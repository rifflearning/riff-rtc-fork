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

/* ******************************************************************************
 * getEmeritusGroup                                                        */ /**
 *
 * Find the Riff group name for the validated student launch using the Emeritus API
 *
 * @param {Object} groupApiConfig
 * @param {Object} req
 *
 * @returns {string}
 */
async function getEmeritusGroup(groupApiConfig, req)
{
  const logger = req.app.get('routerLogger').child({ fn: 'getEmeritusGroup' });

  let { custom_canvas_api_domain: groupApiDomain,
        custom_canvas_course_id:  courseId,
        custom_canvas_user_id:    userId,
      } = req.body; // eslint-disable-line indent

  // The req body values are all strings, but when we query the api we're going to
  // receive the ids as numbers, so convert it for later comparisons.
  userId = parseInt(userId, 10);

  const emeritusReqConfig =
    {
      baseURL: `https://${groupApiDomain}/api/v1/`,
      headers:
      {
        Authorization: `Bearer ${groupApiConfig.authorization_token}`,
      },
    };

  let emeritusReq = axios.create(emeritusReqConfig);

  // NOTE: in general don't log the Authorization header, but leaving it commented out for interactive debugging
  logger.debug({ url: `/courses/${courseId}/groups` /*, emeritusReqConfig*/ }, 'requesting all course groups...');

  let response = await emeritusReq.get(`/courses/${courseId}/groups`);
  let allCourseGroups = response.data;
  logger.debug({ courseId, group_count: allCourseGroups.length }, 'Got all groups for the Emeritus course');

  // filter out the non-riff groups, and only keep a few of the group's properties
  let riffGroupRe = new RegExp(groupApiConfig.riff_group_regex);
  let riffGroups = allCourseGroups.filter(grp => riffGroupRe.test(grp.name))
                                  .map(grp => ({ id: grp.id, name: grp.name, members_count: grp.members_count }));
  logger.debug({ riffGroups,
                 riff_group_count: riffGroups.length,
                 riffGroupRE: groupApiConfig.riff_group_regex }, 'Filtered out all non Riff groups');

  // Check the users of each riff group until we find the group w/ the user doing the launch
  let usersGroup = '';
  for (let grp of riffGroups)
  {
    response = await emeritusReq.get(`/groups/${grp.id}/users`);
    let users = response.data;
    let userFound = users.some(u => u.id === userId);
    logger.debug({ group: grp, users, userId, userFound }, 'users in group');
    // TODO: Cache riffGroups/users in redis for 8-24 hours
    // redis key could be: groupApiDomain + '/' + courseId
    // value: groups: [{id, name, users: [{id, name, login_id}]}]
    if (userFound)
    {
      usersGroup = grp.name;
      break;
    }
  }

  if (!usersGroup)
  {
    let errorContext =
      {
        user:
        {
          id: req.body.user_id,
          custom_id: userId,
          name: req.body.lis_person_name_full,
          email: req.body.lis_person_contact_email_primary,
        },
        course:
        {
          context_id: req.body.context_id,
          context_title: req.body.context_title,
          custom_id: courseId,
          group_count: allCourseGroups.length,
          riff_group_count: riffGroups.length,
        }
      };

    throw new AppError('No group found for Emeritus LTI user', errorContext);
  }

  return usersGroup;
}


// ES6 import compatible export
//        either: import getEmeritusGroup from 'emeritusgroup';
//            or: import { getEmeritusGroup } from 'emeritusgroup';
//   or CommonJS: const { getEmeritusGroup } = require('emeritusgroup');
module.exports =
{
  'default': getEmeritusGroup,
  getEmeritusGroup,
};
