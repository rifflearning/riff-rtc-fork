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


const { EmeritusGroupApi } = require('./emeritusgroup');

// ES6 import compatible export
//    NO default: import EmeritusGroupApi from '.'; // intentionally not supported
//    use either: import { EmeritusGroupApi } from '.';
//   or CommonJS: const { EmeritusGroupApi } = require('.');
module.exports =
{
  EmeritusGroupApi,
};
