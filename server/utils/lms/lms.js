/* ******************************************************************************
 * lms.js                                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview [summary of file contents]
 *
 * [More detail about the file's contents]
 *
 * Created on       October 6, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const util = require('util');
const lti = require('ims-lti');
const appConfig = require('config');

const { loggerInstance } = require('../logger');
const { AppError } = require('../errortypes');
const { getRedisClient } = require('../redisclient');

const { EmeritusGroupApi } = require('../group');


const SEC_PER_MIN = 60;
const SEC_PER_HR = 60 * SEC_PER_MIN;
const SEC_PER_DAY = 24 * SEC_PER_HR;

// TODO: Consider getting this value from the configuration
const USERGROUP_CACHE_EXPIRE_SECS = 2 * SEC_PER_DAY;

/* ******************************************************************************
 * Lms                                                                     */ /**
 *
 * An LMS object (Learning Management System) provides operations related to how
 * Riff interacts with LMSs (such as Canvas and Edx). In particular Riff provides
 * a means for a course at an LMS to launch the Riff Platform (using LTI), taking
 * the student invoking Riff directly into a videochat room w/ their course
 * teammates.
 *
 * An Lms object can only be instantiated if it has configuration values set up.
 * The Lms is identified by a unique consumer_key value, created by Riff.
 *
 ********************************************************************************/
class Lms
{
  /* **************************************************************************
   * constructor                                                         */ /**
   *
   * Lms class constructor.
   *
   * @param {!Lms.Config=} config
   *      The settings to configure this Lms
   *
   */
  constructor(config = {})
  {
    // instance properties
    this.consumerKey = config.consumerKey;
    if (!this.consumerKey)  // eslint-disable-line curly
      throw new TypeError('consumerKey must be defined to create an Lms instance');

    this.logger = (config.logger || loggerInstance).child({ 'class': 'Lms' });

    // Find the LMS config settings for the given consumer key
    let lmss = appConfig.has('server.lmss') ? appConfig.get('server.lmss') : [];
    this.lmsConfig = lmss.find(curLms => curLms.lti.oauth_consumer_key === this.consumerKey);

    if (!this.lmsConfig)
    {
      let context = { consumerKey: this.consumerKey,
                      LMSs: lmss.map(curLms => curLms.name) };
      let msg = 'No LMS configuration found with given consumerKey';
      this.logger.error(context, msg);
      throw new AppError(msg, context, true);
    }

    this.GroupApi = Lms._groupApiMap.get(this.lmsConfig.group_api.type);

    // TODO: this won't create the Lms if there is no GroupApi, is that ok or
    // do we want to be able to do everything else w/ the Lms except group stuff? -mjl 10/7/2018
    if (this.GroupApi === undefined)   // eslint-disable-line curly
      throw new AppError('can\'t handle the LMS\'s configured type of group api', { lmsConfig: this.lmsConfig });
  }

  /* **************************************************************************
   * getGroup                                                            */ /**
   *
   * Use the appropriate algorithm/sources for this LMS to find and return
   * the riff group name for the student doing an LTI launch.
   *
   * @param {ExpressRequest} req
   *      The req object for the LTI launch containing the identifying information
   *      for the student doing the launch.
   *
   * @returns {string} the name of the riff group this student belongs to.
   * @throws {AppError} when a group for the student can't be determined.
   */
  async getGroup(req)
  {
    // Check the cache for the user's group first
    const redisClient = getRedisClient();
    let usergroupKey = Lms.getUsergroupCacheKey({ body: req.body });
    let group = await redisClient.getAsync(usergroupKey);
    if (group)
    {
      this.logger.debug({ usergroupKey, group }, 'LTI usergroup cache hit');
      return group;
    }

    try
    {
      this.logger.debug({ usergroupKey }, 'LTI usergroup cache miss');

      // a groupApi is for a course (aka context) it's easier to create a new one for
      // each request than try to reuse them.
      let groupApi = new this.GroupApi({ req, groupApiConfig: this.lmsConfig.group_api, logger: this.logger });

      group = await groupApi.getGroup(this.GroupApi.getRequestorId(req));

      // cache the user's group
      redisClient.set(usergroupKey, group, 'EX', USERGROUP_CACHE_EXPIRE_SECS);
      return group;
    }
    catch (e)
    {
      /* handle error */
      let errorContext =
        {
          user:
          {
            id: req.body.user_id,
            name: req.body.lis_person_name_full,
            email: req.body.lis_person_contact_email_primary,
          },
          course:
          {
            context_id: req.body.context_id,
            context_title: req.body.context_title,
          },
          prev_error: e,
        };

      this.logger.debug({ err: e, errorContext }, 'getGroup failed');
      throw new AppError('getGroup failed', errorContext);
    }
  }

  /* **************************************************************************
   * isValidRequest                                                      */ /**
   *
   * Determine if the LTI request (POST) is valid by verifying the oauth
   * supplied fields.
   *
   * @param {ExpressRequest} req
   *      The request to be validated.
   *
   * @returns {boolean} Always true, if not valid an error will be thrown.
   * @throws {lti.ParameterError}
   * @throws {lti.SignatureError}
   * @throws {lti.NonceError}
   */
  async isValidRequest(req)
  {
    // skip validity check if debug setting requests it
    if (appConfig.get('server.debug.assume_lti_valid'))
    {
      this.logger.warn('Skipping OAUTH validity check');
      return true;
    }

    // Create the ltiProvider
    let { oauth_consumer_key: consumerKey,
          oauth_consumer_secret: consumerSecret,
        } = this.lmsConfig.lti;   // eslint-disable-line indent

    let client = getRedisClient();
    let store = new lti.Stores.RedisStore('consumer_key', client);
    let ltiProvider = new lti.Provider(consumerKey, consumerSecret, store);
    ltiProvider.valid_request_async = util.promisify(ltiProvider.valid_request);

    // use the ltiProvider to validate the request
    //   returns true or throws an error why request isn't valid
    return await ltiProvider.valid_request_async(req);
  }

  /* **************************************************************************
   * getGroupsCacheKey                                                   */ /**
   *
   * Get the groups cache key. The key used to cache the groups info for a
   * particular course. For a regular LTI launch, the values needed to derive
   * the key are obtained from the POST params, and those properties will be
   * used first if they exist. Otherwise the query properties will be checked
   * to find those values.
   *
   * @param {Object} reqParams
   *      The request parameters (body, query and params objects from the req)
   *
   * @returns {string}
   */
  getGroupsCacheKey(reqParams)
  {
    return this.GroupApi.getGroupsCacheKey(reqParams);
  }

  /* **************************************************************************
   * getUsergroupCacheKey (static)                                       */ /**
   *
   * Get the usergroup cache key. The key used to cache the group name for a
   * particular user in a course. For a regular LTI launch, the values needed
   * to derive the key are obtained from the POST body, and those properties
   * will be used first if they exist. Otherwise the params and query
   * properties will be checked to find those values.
   *
   * @param {Object} body
   *      The request body (contains properties from the POST)
   *
   * @param {Object} query
   *      The request query properties
   *
   * @param {Object} params
   *      The request parameters (extracted from the route)
   *
   * @returns {string}
   */
  static getUsergroupCacheKey({ body = {}, query = {}, params = {} } = {})
  {
    let consumerKey = body.oauth_consumer_key || params.consumerKey || query.consumerKey;
    let contextId = body.context_id || params.contextId || query.contextId;
    let userId = body.user_id || params.userId || query.userId;

    if (consumerKey === undefined || contextId === undefined || userId === undefined)
    {
      let context =
        {
          body,
          query,
          params,
          properties:
          {
            consumerKey: [ 'body.oauth_consumer_key', 'params.consumerKey', 'query.consumerKey' ],
            contextId: [ 'body.context_id', 'params.contextId', 'query.contextId' ],
            userId: [ 'body.user_id', 'params.userId', 'query.userId' ],
          },
        };
      throw new AppError('missing properties to define groups key', context);
    }

    let usergroupCacheKey = `riff-rtc:lti:${consumerKey}:${contextId}:${userId}`;

    return usergroupCacheKey;
  }

}

/* class type definitions */

/* ******************************************************************************
 * Lms.Config                                                              */ /**
 *
 * The Lms.Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a Lms.
 *
 * @typedef {!Object} Lms.Config
 *
 * @property {string} consumerKey
 *      [description of consumerKey]
 *
 * @property {Logger | undefined} logger
 *      [description of logger]
 */

/* class static properties */

/** Map of group_api type to GroupApi class for that type */
Lms._groupApiMap = new Map();
Lms._groupApiMap.set('emeritus', EmeritusGroupApi);


// ES6 import compatible export
//        either: import Lms from './lms';
//            or: import { Lms } from './lms';
//   or CommonJS: const { Lms } = require('./lms');
module.exports =
{
  'default': Lms,
  Lms,
};
