/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Export all public entities from the group modules
 *
 * An index.js file should contain no implementation, its sole purpose is
 * to provide a focal point for exporting all public entities defined by
 * sibling modules.
 *
 * Created on       September 30, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/


const { getLmsGroup } = require('./lmsgroup');

// ES6 import compatible export
//    NO default: import errorTypes from '.'; // intentionally not supported
//    use either: import { getLmsGroup } from '.';
//   or CommonJS: const { getLmsGroup } = require('.');
module.exports =
{
  getLmsGroup,
};
