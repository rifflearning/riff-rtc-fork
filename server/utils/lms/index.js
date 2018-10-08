/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Export all public entities from the lms module(s)
 *
 * An index.js file should contain no implementation, its sole purpose is
 * to provide a focal point for exporting all public entities defined by
 * sibling modules.
 *
 * Created on       October 8, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/


const { Lms } = require('./lms');

// ES6 import compatible export
//        either: import Lms from '.';
//           or: import { Lms } from '.';
//   or CommonJS: const { Lms } = require('.');
module.exports =
{
  'default': Lms,
  Lms,
};
