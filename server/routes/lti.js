/* ******************************************************************************
 * lti.js                                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for the LTI (Learning Tool Integrations)
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

const request = require('request');
const lti = require("ims-lti");
const redis = require("redis");

/* GET single page application */
router.post('/launch', ltiLaunch);


/** Map of active (LMSs which have had a launch request) LMSs */
const activeLMSs = new Map();

/* **************************************************************************
 * ltiLaunch                                                           */ /**
 *
 * Decrypt the LTI packet and return information needed for the user
 * to login and start a video chat.
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
function ltiLaunch(req, res)
{
  console.log('INFO: ltiLaunch');

  req.lti = getLtiProvider(req.body.oauth_consumer_key);
  req.session.body = req.body;
  req.lti.valid_request(req, (err, isValid) =>
    {
      if (err)
      {
        // invalid lti launch request
        console.log(err);
        return res.send("LTI Verification failed!");
      }

      req.session.isValid = isValid;
      // collect the data we're interested in from the request
      let email = req.body.lis_person_contact_email_primary;
      let ltiData =
        {
          lti_user: true,
          user_id: req.body.user_id,
          email,
          name: req.body.lis_person_name_full,
          context_id: req.body.context_id,
          room: get_room(email),
        };

      return res.json(ltiData);
    });
}

function getLtiProvider(oathConsumerKey)
{
  // Note: although not 100% clear from the ims-lti docs, it seems that a new
  // provider should be created for each request.

  // If we've already created the ltiProvider, return it
  if (activeLMSs.has(oathConsumerKey))
  {
    return activeLMSs.get(oathConsumerKey).lti.provider;
  }

  // Find the matching oathConsumerSecret
  let lmss = config.get('server.lti.lmss');

  let lms = lmss.find(lms => lms.lti.oath_consumer_key === oathConsumerKey);

  if (!lms)
  {
    throw new Error(`No LMS found with given oath_consumer_key: ${oathConsumerKey}`);
  }

  // Clone the config object so we can add the ltiProvider and store it in the activeLMSs map
  lms = config.util.cloneDeep(lms);

  // Create the ltiProvider
  let client = redis.createClient(config.get('server.lti.redisUrl'));
  store = new lti.Stores.RedisStore('consumer_key', client);
  lms.lti.provider = new lti.Provider(lms.lti.oath_consumer_key, lms.lti.oath_consumer_secret, store);
  activeLMSs.set(lms.lti.oath_consumer_key, lms);
  return lms.lti.provider;
}

module.exports = router;
