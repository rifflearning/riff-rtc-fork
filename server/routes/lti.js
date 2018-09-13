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

const config = require('config');

const request = require('request');
const lti = require("ims-lti");
const redis = require("redis");

const { loggerInstance: logger } = require('../utils/logger');

/* GET single page application */
router.post('/launch', ltiLaunch);

router.get('/launch', (req, res) => { return res.send('Hello there from lti launch get'); });


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
  logger.debug({ body: req.body }, 'ltiLaunch');

  try
  {
    if (!req.body || !req.body.oauth_consumer_key)
      throw new Error('Request body did not contain an oauth_consumer_key value!');

    lti = getLtiProvider(req.body.oauth_consumer_key);
  }
  catch (e)
  {
    let errmsg = 'Could not configure LTI Provider, check consumer key and LMS list!';
    logger.error(e.toString());
    logger.debug({ err: e });
    res.status(400); // Bad Request
    return res.send(errmsg);
  }

  req.session.body = req.body;
  lti.valid_request(req, (err, isValid) =>
    {
      if (err)
      {
        // invalid lti launch request
        let errmsg = 'LTI Verification failed!';
        logger.error({ err }, errmsg);
        res.status(400); // Bad Request
        return res.send(errmsg);
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
  // Find the matching oathConsumerSecret
  let lmss = config.has('server.lti.lmss') ? config.get('server.lti.lmss') : [];
  let lms = lmss.find(lms => lms.lti.oath_consumer_key === oathConsumerKey);

  if (!lms)
  {
    logger.error({ oath_consumer_key: oathConsumerKey,
                   LMSs: lmss.map(lms => lms.name) }, 'No LMS found with given oath_consumer_key');
    throw new Error(`No LMS found with given oath_consumer_key: ${oathConsumerKey}`);
  }

  // Clone the config object so we can add the ltiProvider and store it in the activeLMSs map
  lms = config.util.cloneDeep(lms);

  // Create the ltiProvider
  let client = redis.createClient(config.get('server.lti.redisUrl'));
  store = new lti.Stores.RedisStore('consumer_key', client);
  let ltiProvider = new lti.Provider(lms.lti.oath_consumer_key, lms.lti.oath_consumer_secret, store);
  return ltiProvider;
}

module.exports = router;
