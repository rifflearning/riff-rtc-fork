/* ******************************************************************************
 * spaindex.js                                                                  *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for the spa (Single Page Application)
 *
 * Returns the html to load the SPA in a browser.
 *
 * Created on       September 12, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const path = require('path');
const config = require('config');

const rtcServerVer = require('../../package.json').version;


/** Path to the SPA's main html file */
const indexPath = path.join(__dirname, '../../build/index.html');

/** client configuration values that need to be added to main html file at runtime */
const clientConfig = { rtcServerVer, ...(config.get('client')) };
const client_config = JSON.stringify(clientConfig);

/* **************************************************************************
 * spaIndex                                                            */ /**
 *
 * render the single page application index.html file with any lti_data
 * from an ltiLaunch and the client configuration values from this server.
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
function spaIndex(req, res)
{
  const logger = req.app.get('routerLogger').child({ route_handler: 'spaIndex' });

  // session.ltiData will exist when launching the SPA via LTI (see route handler ltiLaunch)
  let lti_data = req.session.ltiData ? JSON.stringify(req.session.ltiData) : '{lti_user: false}';
  res.render(indexPath, { client_config, lti_data });
  logger.debug({ req, res, ltiData: req.session.ltiData || 'none' }, '...exiting spaIndex');
}

//
// ES6 import compatible export
//        either: import spaIndex from 'spaindex';
//            or: import { spaIndex } from 'spaindex';
//   or CommonJS: const { spaIndex } = require('spaindex');
module.exports =
{
  default: spaIndex,
  spaIndex,
};
