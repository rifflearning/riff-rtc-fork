/* ******************************************************************************
 * deletecachedusergroup.js                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for deleting the cached record for a user's group
 *
 * [More detail about the file's contents]
 *
 * Created on       October 8, 2018
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
 * asyncDeleteCachedUsergroup                                          */ /**
 *
 * Delete the cached group for the specified user/course.
 *
 * There are 2 levels of cached group information, this is the first. You
 * will also have to delete the cached groups {@link deleteCachedGroups} if
 * you want to force the group for this user to be obtained from the LMS's
 * group api.
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
async function asyncDeleteCachedUsergroup(req, res/*, next*/)
{
  const logger = req.app.get('routerLogger').child({ route_handler: 'deleteCachedUsergroup' });

  logger.debug({ req, reqUrl: req.url, reqOrigUrl: req.originalUrl, params: req.params, query: req.query },
               'deleteCachedUsergroup entered...');

  let key = null;

  try
  {
    key = Lms.getUsergroupCacheKey({ params: req.params, query: req.query });
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
                 'Internal error deleting cached usergroup');
    res.status(500); // Internal Server Error
    return res.end();
  }
}


// Make sure that all extraneous error paths from the async route handler are dealt with.
const deleteCachedUsergroup = expressAsyncHandler(asyncDeleteCachedUsergroup);


// ES6 import compatible export
//        either: import deleteCachedUsergroup from './deletecachedusergroup';
//            or: import { deleteCachedUsergroup } from './deletecachedusergroup';
//   or CommonJS: const { deleteCachedUsergroup } = require('./deletecachedusergroup');
module.exports =
{
  'default': deleteCachedUsergroup,
  deleteCachedUsergroup,
};
