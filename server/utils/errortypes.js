/* ******************************************************************************
 * errortypes.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Application specific Error types (classes) derived from Error
 *
 * [More detail about the file's contents]
 *
 * Created on       October 1, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/


/* ******************************************************************************
 * AppError                                                                */ /**
 *
 * An AppError is the base error type for application errors, and may be initialized
 * with a message and a context object.
 *
 ********************************************************************************/
class AppError extends Error
{
  /* **************************************************************************
   * constructor                                                         */ /**
   *
   * AppError class constructor.
   *
   * @param {string} message
   * @param {Object} context
   * @param {boolean} logged
   */
  constructor(message, context = {}, logged = false)
  {
    super(message);
    this.name = 'AppError';
    this.context = context;
    this.logged = logged;
  }
}

// ES6 import compatible export
//    NO default: import errorTypes from 'errortypes'; // intentionally not supported
//    use either: import { LoggedError } from 'errortypes';
//   or CommonJS: const { LoggedError } = require('errortypes');
module.exports =
{
  AppError,
};
