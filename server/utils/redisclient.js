/* ******************************************************************************
 * redisclient.js                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview Maintain the redis connections (clients), currently a singleton.
 *
 * [More detail about the file's contents]
 *
 * Created on       October 3, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const util = require('util');
const config = require('config');
const redis = require('redis');

/** The redis client singleton w/ an active connection to the redis server. */
let clientInstance = null;

/* ******************************************************************************
 * getRedisClient                                                          */ /**
 *
 * Get the redis client for this app.
 *
 * @returns {RedisClient}
 *    A redis client w/ an active connection to a redis server.
 */
function getRedisClient()
{
  if (clientInstance !== null)
  {
    // If someone using the existing clientInstance called quit or end
    // so it no longer has an active connection, drop that client
    // object and create and return another.
    // NOTE: This may not be a valid interpretation in of `connected`
    // or how to tell that quit or end was called but reading the redis
    // docs I'm not sure how else to tell. -mjl
    if (clientInstance.connected) // eslint-disable-line curly
      return clientInstance;

    clientInstance = null;
  }

  // create a new redis client instance
  clientInstance = redis.createClient(config.get('server.lti.redisUrl'));
  clientInstance.getAsync = util.promisify(clientInstance.get);
  clientInstance.setAsync = util.promisify(clientInstance.set);
  clientInstance.existsAsync = util.promisify(clientInstance.exists);

  return clientInstance;
}


// ES6 import compatible export
//    NO default: import getRedisClient from './redisclient'; // intentionally not supported
//        either: import { getRedisClient } from './redisclient';
//   or CommonJS: const { getRedisClient } = require('./redisclient');
module.exports =
{
  getRedisClient,
};
