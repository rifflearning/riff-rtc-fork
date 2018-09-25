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
 * DEVNOTE: More googling found this page (which references an npm package)
 *   article: [Using Async Await in Express with Node 9](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016)
 *   npm package: https://www.npmjs.com/package/express-async-handler
 *   git repo: https://github.com/Abazhenov/express-async-handler
 *
 *   I'm not sure that using a tiny package like that is worth replacing
 *   this simple code. But it was worth updating this code to match what
 *   is there, since the package was updated to address several issues.
 *
 *
 * Created on       September 23, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/* ******************************************************************************
 * asyncUtil                                                               */ /**
 *
 * Intended to wrap an async function whose last argument is an error callback
 * such that the error callback is called w/ any promise reject from the async
 * function.
 *
 * @param {function(...args): any} fn
 *      a possibly async function whose last arg is an error handler function
 *      taking a single error argument.
 *
 * @returns {function(...args): Promise}
 */
const asyncUtil = fn =>
  function asyncUtilWrap(...args)
  {
    const fnReturn = fn(...args);
    const next = args[args.length-1];
    return Promise.resolve(fnReturn).catch(next);
  };

// ES6 import compatible export
//        either: import expressAsyncHandler from 'express_asynchandler';
//            or: import { expressAsyncHandler } from 'express_asynchandler';
//   or CommonJS: const { expressAsyncHandler } = require('express_asynchandler');
module.exports =
{
  default: asyncUtil,
  expressAsyncHandler: asyncUtil,
};
