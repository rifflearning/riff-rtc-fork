#! /usr/bin/env node
/* ******************************************************************************
 * ltigen.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Generate an LTI key and secret
 *
 * Given a prefix for the LTI consumer key (e.g. 'canvas-emeritus_')
 * add a computed suffix (using a simple hash algorithm of the prefix) to
 * make the actual key somewhat more difficult to guess.
 * Also generate a random 32 hex digit consumer secret.
 *
 * Based on advice from [The Client ID and Secret](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/)
 *
 * Created on       September 20, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Michael Jay Lippert
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " SOME_PARAM");
    process.exit(-1);
}

var params = process.argv.slice(2);

let baseKeyName = params[0] || 'canvas-emeritus_';
process.stdout.write(`   consumer_key: ${baseKeyName}${getSimpleHash(baseKeyName)}\n`);
process.stdout.write(`consumer_secret: ${newSecret()}\n`);

process.exit(0);

/* **************************************************************************
 * getSimpleHash                                                       */ /**
 *
 * XOR the bytes in the given string (as an array of 2 byte integers)
 * return a string of the least 4 significant digits of the result
 * in decimal.
 *
 * @param {string} s
 *      String to be hashed
 *
 * @returns {string} 4 characters that are are derived from the given
 * string (ie not random).
 */
function getSimpleHash(s)
{
  // convert string to array of numbers
  let ints = [];
  for (i = 0; i < s.length; ++i)
  {
    if (i % 2 === 0)
    {
      ints.push(s.charCodeAt(i));
    }
    else
    {
      let v = ints.pop();
      v = (v << 6) + s.charCodeAt(i);
      ints.push(v);
    }
  }

  // xor the nunbers
  let v = ints.reduce((xv, cv) => xv ^ cv, 0);
  // return last 4 digits
  return v.toString().slice(-4);
}

/* **************************************************************************
 * newSecret                                                           */ /**
 *
 * [Description of newSecret]
 *
 * @param {string}
 *      [Description of the  parameter]
 *
 * @returns {string}
 */
function newSecret()
{
  const SECRET_LEN = 32;
  let secret = '';
  let randomBytes = [];

  for (let i = Math.floor((SECRET_LEN + 3) / 4); i > 0; --i)
  {
    let r = (1 << 16) * Math.random();
    randomBytes.push(r >> 8);
    randomBytes.push(r & 0xFF);
  }

  return randomBytes.map(b => (b < 16 ? '0' : '') + b.toString(16)).join('').slice(0, SECRET_LEN);
}
