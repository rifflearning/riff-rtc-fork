/* ******************************************************************************
 * express_asynchandler.js                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Wrapper function for async express route handlers/middleware
 *
 * The expressAsyncHandler takes an async function w/ 3 parameters and
 * returns a new function which calls that function and catches any errors
 * thrown or rejected and passes them on to the 3rd param (the next callback).
 *
 * Use it like this:
 * async function asyncRouteHndlr(req, res, next) {}
 * const routeHndlr = expressAsyncHandler(asyncRouteHndlr);
 * app.get('/foo', routeHndlr);
 *
 * Created on       September 23, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* **************************************************************************
 * expressAsyncHandler                                                 */ /**
 *
 * [Description of expressAsyncHandler]
 *
 * @param {function(req, res, next): any} fn
 *      [Description of the fn parameter]
 *
 * @returns {function(req, res, next): Promise}
 */
const expressAsyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);

// ES6 import compatible export
//        either: import expressAsyncHandler from 'express_asynchandler';
//            or: import { expressAsyncHandler } from 'express_asynchandler';
//   or CommonJS: const { expressAsyncHandler } = require('express_asynchandler');
module.exports =
{
  default: expressAsyncHandler,
  expressAsyncHandler,
};
