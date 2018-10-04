/* ******************************************************************************
 * lmsgroup.js                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview Get the group name for an LTI launch
 *
 * The method used to find a group name depends on the group API of the LMS
 * which instigated the launch. The group name for the student performing
 * the launch may also have been cached.
 *
 * Created on       September 30, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const { EmeritusGroupApi } = require('./emeritusgroup');
const { getRedisGroup } = require('./redisgroup');
const { getRedisClient } = require('../redisclient');
const { AppError } = require('../errortypes');


/* ******************************************************************************
 * getLmsGroup                                                             */ /**
 *
 * Use the appropriate algorithm/sources for the given LMS to find and return
 * the riff group name for the student doing an LTI launch.
 *
 * @param {Object} lms
 * @param {Object} req
 *
 * @returns {string}
 */
async function getLmsGroup(lms, req)
{
  const logger = req.app.get('routerLogger').child({ fn: 'getLmsGroup' });

  let group = 'riff_Team 0';

  try
  {
    const groupApi = _groupFactory(lms, req, req.app.get('routerLogger'));
    if (groupApi === null)  // eslint-disable-line curly
      throw new AppError('can\'t handle the LMS\'s configured type of group api', { lms });

    group = await groupApi.getGroup(groupApi.getRequesterId(req));
    // TODO: cache the group found for this user in redis for 8-24 hours
    // redis key could be: lms.consumer_key + '/' + req.body.context_id + '/' + req.body.user_id
    // value: group_name
    // setRedisGroup(group, { lmsId: lms.consumer_key, courseId: req.body.context_id, userId: req.body.user_id });
  }
  catch (e)
  {
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

    logger.debug({ err: e, errorContext }, 'getGroup failed');
    throw new AppError('getGroup failed', errorContext);
  }

  logger.info({ user: { id: req.body.user_id, name: req.body.lis_person_name_full },
                group }, 'found group for student');
  return group;
}

/** Map of group_api type to GroupApi class for that type */
const groupApiMap = new Map();
groupApiMap.set('emeritus', EmeritusGroupApi);

/* ******************************************************************************
 * _groupFactory                                                           */ /**
 *
 * [Description of _groupFactory]
 *
 * @param {string} lms
 *      [Description of the lms parameter]
 *
 * @param {string} req
 *      [Description of the req parameter]
 *
 * @returns {string}
 */
function _groupFactory(lms, req, logger)
{
  if (!groupApiMap.has(lms.group_api.type)) // eslint-disable-line curly
    return null;

  const GroupApi = groupApiMap.get(lms.group_api.type);
  const groupApi = new GroupApi({ lms, req, logger });
  return groupApi;
}


// ES6 import compatible export
//        either: import getLmsGroup from 'lmsgroup';
//            or: import { getLmsGroup } from 'lmsgroup';
//   or CommonJS: const { getLmsGroup } = require('lmsgroup');
module.exports =
{
  'default': getLmsGroup,
  getLmsGroup,
};
