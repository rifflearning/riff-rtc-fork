/* ******************************************************************************
 * router_apilti.js                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview Express router for the Riff LTI (Learning Tool Integrations) API.
 *
 * Currently this file serves as a placeholder for future functionality/example
 * of a router implementation.
 *
 * Created on       September 12, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const express = require('express');
const router = express.Router();


router.use((req, res, next) =>
  {
    const appLogger = req.app.get('appLogger');
    req.app.set('routerLogger', appLogger.child({ router: 'apilti' }));
    next();
  });

/* GET single page application */
router.get('/launch', get_launch);


/* **************************************************************************
 * get_launch                                                          */ /**
 *
 * Handle getting the lti/launch route. I.e. do nothing, since this isn't
 * a defined endpoint at this time.
 *
 * NOTE: This route handler is only defined in the router source file because
 * it is trivial and does nothing. If it did anything real it would be in its
 * own file.
 */
function get_launch(req, res, next)
{
  const logger = req.app.get('routerLogger').child({ route_handler: 'get_launch' });

  logger.warn({ req }, 'GET /api/lti/launch is not expected to do anything at this time!');
  return res.send('Hello there from apilti launch get');
}


// ES6 import compatible export
//        either: import ltiRouter from 'router_apilti';
//            or: import { ltiRouter } from 'router_apilti';
//   or CommonJS: const { ltiRouter } = require('router_apilti');
module.exports =
{
  default: router,
  ltiRouter: router,
};
