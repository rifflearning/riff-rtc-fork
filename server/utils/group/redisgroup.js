/* ******************************************************************************
 * redisgroup.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview [summary of file contents]
 *
 * [More detail about the file's contents]
 *
 * Created on       September 30, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const redis = require('redis');


/* ******************************************************************************
 * getRedisGroup                                                           */ /**
 *
 * [Description of getRedisGroup]
 *
 * @param {Object} lms
 * @param {Object} req
 *
 * @returns {string}
 */
async function getRedisGroup(lms, req)
{
  let group = 'riff_Redis Team 0';

  redis;
  lms;
  req;


  return group;
}


// ES6 import compatible export
//        either: import getRedisGroup from 'redisgroup';
//            or: import { getRedisGroup } from 'redisgroup';
//   or CommonJS: const { getRedisGroup } = require('redisgroup');
module.exports =
{
  'default': getRedisGroup,
  getRedisGroup,
};
