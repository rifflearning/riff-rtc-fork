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

const { getEmeritusGroup } = require('./emeritusgroup');
const { getRedisGroup } = require('./redisgroup');


/** Map of group_api type to getGroup fn for that type */
const groupApiMap = new Map();
groupApiMap.set('emeritus', getEmeritusGroup);

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

  if (!groupApiMap.has(lms.group_api.type)) // eslint-disable-line curly
    return group;

  const getGroup = groupApiMap.get(lms.group_api.type);

  try
  {
    group = await getGroup(lms.group_api, req);
    // TODO: cache the group found for this user in redis for 8-24 hours
    // redis key could be: lms.consumer_key + '/' + req.body.context_id + '/' + req.body.user_id
    // value: group_name
    // setRedisGroup(group, { lmsId: lms.consumer_key, courseId: req.body.context_id, userId: req.body.user_id });
  }
  catch (e)
  {
    /* handle error */
    logger.error({ err: e, error_context: e.context }, 'getGroup failed');
  }

  return group;
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
