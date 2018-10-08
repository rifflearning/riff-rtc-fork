/* ******************************************************************************
 * emeritusgroup.js                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview Find the Riff group name for a student using the Emeritus API
 *
 * The algorithm for Emeritus was described in an email from Kunal Ashar:
 *   Use the custom_canvas_course_id value to call the Canvas REST API
 *   "/api/v1/courses/:course_id/groups" to GET the list of *ALL* the groups in that
 *   course:
 *   ex.: https://student.emeritus.org/api/v1/courses/11/groups.
 *
 *   Now, use the groups' IDs to list the users in each group. You can also walk
 *   through the JSON to find the group name that starts with "riff_" (if there's one
 *   or more). call the Canvas REST API "/api/v1/groups/:group_id/users" to GET the
 *   list of *ALL* the users in a group:
 *   ex.: https://student.emeritus.org/api/v1/groups/356/users.
 *
 *   Use your developer key(access token) as the bearer token for the above API calls.
 *
 * DevNote:
 *   Consider using the developer ID and key to request an authorization token
 *   on behalf of the student. see https://canvas.instructure.com/doc/api/file.oauth.html
 *
 * Created on       September 30, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const axios = require('axios');

const { AppError } = require('../errortypes');
const { getRedisClient } = require('../redisclient');

const SEC_PER_MIN = 60;
const SEC_PER_HR = 60 * SEC_PER_MIN;

// TODO: Consider getting this value from the configuration
const GROUPS_CACHE_EXPIRE_SECS = 24 * SEC_PER_HR;


/* ******************************************************************************
 * EmeritusGroupApi                                                        */ /**
 *
 * [Description of the EmeritusGroupApi class]
 *
 ********************************************************************************/
class EmeritusGroupApi
{
  /* **************************************************************************
   * constructor                                                         */ /**
   *
   * EmeritusGroupApi class constructor.
   *
   * @param {EmeritusGroupApi.Config} config
   *      The settings to configure this EmeritusGroupApi
   */
  constructor({ groupApiConfig, req, logger } = {})
  {
    this.logger = (logger || req.app.get('routerLogger')).child({ 'class': 'EmeritusGroupApi' });

    // instance properties
    ({ custom_canvas_api_domain: this.apiDomain,
       custom_canvas_course_id:  this.customCourseId,
       context_id:               this.contextId,
     } = req.body);  // eslint-disable-line indent

    this.groupApiConfig = groupApiConfig;
    this.groupsCacheKey = EmeritusGroupApi.getGroupsCacheKey({ body: req.body });
  }

  /* **************************************************************************
   * getGroup                                                            */ /**
   *
   * Get the name of the group the requestor belongs to. An error is thrown
   * if the requestor doesn't belong to any group.
   *
   * @param {string} requestorId
   *      The ID of the user whose riff group is to be found and returned.
   *
   * @returns {string}
   */
  async getGroup(requestorId)
  {
    let groups = await this._getGroups();
    let groupForUser = groups.find(EmeritusGroupApi._isUserInGroup(requestorId));

    if (groupForUser) // eslint-disable-line curly
      return groupForUser.name;

    // No group was found for the user, throw an error
    let errorContext =
      {
        user:
        {
          // id: req.body.user_id,
          custom_id: requestorId,
          // name: req.body.lis_person_name_full,
          // email: req.body.lis_person_contact_email_primary,
        },
        course:
        {
          context_id: this.contextId,
          // context_title: req.body.context_title,
          custom_id: this.customCourseId,
          riff_group_count: groups.length,
        }
      };

    throw new AppError('No group found for Emeritus LTI user', errorContext);
  }

  /* **************************************************************************
   * getRequestorId (static)                                             */ /**
   *
   * [Description of getRequestorId]
   *
   * @param {ExpressRequest} req
   *      [Description of the req parameter]
   *
   * @returns {number}
   */
  static getRequestorId(req)
  {
    // The req body values are all strings, but when we query the api we're
    // going to receive the ids as numbers, so the id we return is converted
    // to avoid having to convert it later for comparisons.
    return parseInt(req.body.custom_canvas_user_id, 10);
  }

  /* **************************************************************************
   * getGroupsCacheKey (static)                                          */ /**
   *
   * Get the groups cache key. The key used to cache the groups info for a
   * particular course. For a regular LTI launch, the values needed to derive
   * the key are obtained from the POST body, and those properties will be
   * used first if they exist. Otherwise the params and query properties will
   * be checked to find those values.
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
  static getGroupsCacheKey({ body = {}, query = {}, params = {} } = {})
  {
    let apiDomain = body.custom_canvas_api_domain || params.domain || query.domain;
    let contextId = body.context_id || params.contextId || query.contextId;

    if (apiDomain === undefined || contextId === undefined)
    {
      let context =
        {
          body,
          query,
          params,
          properties:
          {
            apiDomain: [ 'body.custom_canvas_api_domain', 'params.domain', 'query.domain' ],
            contextId: [ 'body.context_id', 'params.contextId', 'query.contextId' ],
          },
        };
      throw new AppError('missing properties to define groups key', context);
    }

    let groupsCacheKey = `riff-rtc:emeritus:${apiDomain}:${contextId}`;

    return groupsCacheKey;
  }

  /* **************************************************************************
   * _getGroups                                                          */ /**
   *
   * Get the groups for this.contextId.
   *
   * @returns {EmeritusGroups}
   */
  async _getGroups()
  {
    let groups = await this._getGroupsFromCache();
    if (groups !== null)
    {
      this.logger.debug({ groupsCacheKey: this.groupsCacheKey, groups }, 'Emeritus groups cache hit');
    }
    else
    {
      this.logger.debug({ groupsCacheKey: this.groupsCacheKey }, 'Emeritus groups cache miss');

      groups = await this._getGroupsFromLMS();

      this.logger.debug('Successfully got riff course groups directly from Emeritus');

      const redisClient = getRedisClient();
      redisClient.set(this.groupsCacheKey, JSON.stringify(groups), 'EX', GROUPS_CACHE_EXPIRE_SECS);
    }

    return groups;
  }

  /* **************************************************************************
   * _getGroupsFromCache                                                 */ /**
   *
   * Get the groups for this.contextId from the cache or null if the groups
   * are not in the cache.
   *
   * @returns {?EmeritusGroups}
   */
  async _getGroupsFromCache()
  {
    const redisClient = getRedisClient();
    let groupsJson = await redisClient.getAsync(this.groupsCacheKey);
    let groups = null;
    if (groupsJson)   // eslint-disable-line curly
      groups = JSON.parse(groupsJson);
    return groups;
  }

  /* **************************************************************************
   * _getGroupsFromLMS                                                   */ /**
   *
   * Get the groups for this.contextId by querying the LMS REST API.
   *
   * @returns {EmeritusGroups}
   */
  async _getGroupsFromLMS()
  {
    const emeritusReqConfig =
      {
        baseURL: `https://${this.apiDomain}/api/v1/`,
        headers:
        {
          Authorization: `Bearer ${this.groupApiConfig.authorization_token}`,
        },
      };

    let emeritusReq = axios.create(emeritusReqConfig);

    // NOTE: in general don't log the Authorization header, but leaving it commented out for interactive debugging
    let groupsEndpoint = `/courses/${this.customCourseId}/groups`;
    this.logger.debug({ url: groupsEndpoint /*, emeritusReqConfig*/ }, 'requesting all course groups...');

    let response = await emeritusReq.get(groupsEndpoint);
    let allCourseGroups = response.data;
    this.logger.debug({ customCourseId: this.customCourseId,
                        group_count: allCourseGroups.length }, 'Got all groups for the Emeritus course');

    // filter out the non-riff groups, and only keep a few of the group's properties
    let riffGroupRe = new RegExp(this.groupApiConfig.riff_group_regex);
    let riffGroups = allCourseGroups.filter(grp => riffGroupRe.test(grp.name))
                                    .map(grp => ({ id: grp.id, name: grp.name, members_count: grp.members_count }));
    this.logger.debug({ riffGroups,
                        riff_group_count: riffGroups.length,
                        riffGroupRE: riffGroupRe.toString() }, 'Filtered out all non Riff groups');

    // get the users for all Riff groups
    let usersResponses = await Promise.all(riffGroups.map(grp => emeritusReq.get(`/groups/${grp.id}/users`)));

    /* eslint-disable indent */
    let groups = riffGroups.map(
                  (grp, i) =>
                  {
                    let users = usersResponses[i].data.map(u => ({ custom_id: u.id,
                                                                   name: u.name,
                                                                   email: u.login_id }));
                    return { ...grp, users };
                  });
    /* eslint-enable indent */

    return groups;
  }

  /* **************************************************************************
   * _isUserInGroup (static)                                             */ /**
   *
   * [Description of _isUserInGroup]
   *
   * @param {string} customUserId
   *      [Description of the customUserId parameter]
   *
   * @returns {function(grp): boolean}
   */
  static _isUserInGroup(customUserId)
  {
    /* eslint-disable indent */
    return (grp) =>
           {
             return grp.users.some(u => u.custom_id === customUserId);
           };
    /* eslint-enable indent */
  }
}

/* ******************************************************************************
 * EmeritusGroupApi.Config                                                 */ /**
 *
 * The EmeritusGroupApi.Config defines the object passed to the constructor that
 * contains options/values used to initialize an instance of a EmeritusGroupApi.
 *
 * @typedef {!Object} EmeritusGroupApi.Config
 *
 * @property {GroupApiConfig} groupApiConfig
 *      The group api configuration for an Emeritus canvas instance containing the
 *      information needed to query the LMS for group information.
 *
 * @property {ExpressRequest} req
 *      The express request containing the values for the course that contains
 *      the groups to be examined.
 *
 * @property {Logger | undefined} logger
 */


// ES6 import compatible export
//        either: import EmeritusGroupApi from './emeritusgroup';
//            or: import { EmeritusGroupApi } from './emeritusgroup';
//   or CommonJS: const { EmeritusGroupApi } = require('./emeritusgroup');
module.exports =
{
  'default': EmeritusGroupApi,
  EmeritusGroupApi,
};
