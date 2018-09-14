/* ******************************************************************************
 * spa.js                                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for the spa (Single Page Application)
 *
 * [More detail about the file's contents]
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

const path = require('path');
const config = require('config');

const rtcServerVer = require('../../package.json').version;
const { loggerInstance } = require('../utils/logger');
const logger = loggerInstance.child({ router: 'spa' });

/* GET single page application */
router.get('*', spaIndex);

/** Path to the SPA's main html file */
const indexPath = path.join(__dirname, '../../build/index.html');

/** client configuration values that need to be added to main html file at runtime */
const clientConfig = { rtcServerVer, ...(config.get('client')) };
const client_config = JSON.stringify(clientConfig);

/* **************************************************************************
 * spaIndex                                                            */ /**
 *
 * render the single page application index.html file with the user_data
 * and the client configuration.
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
function spaIndex(req, res)
{
  let user_data = req.session.user_data ? JSON.stringify(req.session.user_data) : '{}';
  res.render(indexPath, { client_config, user_data });
  logger.debug({req, res});
}

module.exports = router;
