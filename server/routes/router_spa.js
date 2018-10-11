/* ******************************************************************************
 * router_spa.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Express router for the spa (Single Page Application)
 *
 * Router for all routes that launch the SPA.
 *
 * Created on       September 12, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const express = require('express');
const router = express.Router();

const config = require('config');

const { ltiLaunch } = require('./ltilaunch');
const { spaIndex } = require('./spaindex');


router.use(
  (req, res, next) =>
  {
    const appLogger = req.app.get('appLogger');
    req.app.set('routerLogger', appLogger.child({ router: 'spa' }));
    next();
  });

/* LTI launches have the user credentials in the POST body and they need to be
 * authenticated by checking the oauth signature,
 * after which we will return the SPA index file w/ some extra information
 * in a global window property named `lti_data`.
 */
if (config.get('server.lti.enabled'))
{
  router.post('/lti/launch/:route*', ltiLaunch, spaIndex);
}

/* GET single page application */
router.get('*', spaIndex);


// ES6 import compatible export
//        either: import spaRouter from 'router_spa';
//            or: import { spaRouter } from 'router_spa';
//   or CommonJS: const { spaRouter } = require('router_spa');
module.exports =
{
  'default': router,
  spaRouter: router,
};
