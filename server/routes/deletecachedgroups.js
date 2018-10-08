/* ******************************************************************************
 * deletecachedgroups.js                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for deleting all cached records for ???
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

const { getRedisClient } = require('../utils/redisclient');
const { expressAsyncHandler } = require('../utils/express_asynchandler');
const { Lms } = require('../utils/lms');
const { AppError } = require('../utils/errortypes');


/* **************************************************************************
 * asyncDeleteCachedGroups                                             */ /**
 *
 * Delete all cached groups for the specified LMS. This deletes the intermediate
 * cache records specific to the LMS, it does NOT delete the cached group
 * for a specific LMS user.
 * This is used to force reloading the groups from the LMS's group api so it
 * will pick up any changes (new groups and/or new/removed group members).
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 *
 * @returns {Promise} resolved when cached records are deleted.
 */
async function asyncDeleteCachedGroups(req, res/*, next*/)
{
  const logger = req.app.get('routerLogger').child({ route_handler: 'deleteCachedGroups' });

  logger.debug({ req, reqUrl: req.url, reqOrigUrl: req.originalUrl, params: req.params, query: req.query },
               'deleteCachedGroups entered...');

  let lms = new Lms({ consumerKey: req.params.consumerKey, logger });
  let key = null;

  try
  {
    key = lms.getGroupsCacheKey({ query: req.query });
  }
  catch (e)
  {
    let msg = 'cache key is undefined';
    let context = { err: e, params: req.params, query: req.query };
    if (e instanceof AppError && !e.logged)
    {
      msg = e.message;
      context = e.context;
    }
    logger.error(context, msg);
    res.status(400);  // Bad request
    return res.send(`${msg}\n\n${JSON.stringify(context, null, 2)}`);
  }

  try
  {
    const client = getRedisClient();

    let value = await client.getAsync(key);
    if (value === null)
    {
      logger.warn({ key }, 'deleting key which does not exist');
      res.status(404);  // Not found
      return res.end();
    }
    else
    {
      await client.delAsync(key);
      let context = { key, value };
      logger.info(context, 'deleted cache key');
      return res.json(context);
    }
  }
  catch (err)
  {
    logger.error({ err, params: req.params, query: req.query },
                 'Internal error deleting cached groups for course');
    res.status(500); // Internal Server Error
    return res.end();
  }
}


// Make sure that all extraneous error paths from the async route handler are dealt with.
const deleteCachedGroups = expressAsyncHandler(asyncDeleteCachedGroups);


// ES6 import compatible export
//        either: import deleteCachedGroups from './deletecachedgroups';
//            or: import { deleteCachedGroups } from './deletecachedgroups';
//   or CommonJS: const { deleteCachedGroups } = require('./deletecachedgroups');
module.exports =
{
  'default': deleteCachedGroups,
  deleteCachedGroups,
};
