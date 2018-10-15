/* ******************************************************************************
 * lticonfig.js                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview Express route handler for LTI configuration for Riff
 *
 * [More detail about the file's contents]
 *
 * Created on       September 27, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const { js2xml } = require('xml-js');


/* **************************************************************************
 * ltiConfig                                                           */ /**
 *
 * Respond w/ an LTI XML configuration for Riff chat.
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
function ltiConfig(req, res)
{
  const logger = req.app.get('routerLogger').child({ route_handler: 'ltiConfig' });

  logger.debug({ req, reqUrl: req.url, reqOrigUrl: req.originalUrl, body: req.body }, 'ltiConfig entered...');

  let path = req.query.path || '/room';
  path = path.startsWith('/') ? path : `/${path}`;
  let config = getConfig({ scheme: req.protocol, host: req.hostname, path });
  let xmlConfig = js2xml(config, { compact: true, spaces: 2 });
  res.type('text/xml');
  res.send(xmlConfig);

  logger.debug({ res, xmlConfig }, 'exiting ltiConfig');
}

/* ******************************************************************************
 * getConfig                                                               */ /**
 *
 * Get a compact js XML representation of the LTI configuration.
 *
 * @param {string} scheme
 * @param {string} host
 *
 * @returns {Object}
 */
function getConfig({ scheme = 'https', host = 'localhost', path = '/room' } = {})
{
  const mapPath =
    {
      '/room':  { title: 'Riff Video Chat' },
      '/riffs': { title: 'Riff Meeting Metrics' },
      '/':      { title: 'Riff Platform' },
    };
  // Possibly dynamic (ie we may want to change them at runtime) LTI configuration field(s)
  let ltiLaunchUrl = `${scheme}://${host}/lti/launch${path}`;
  const toolTitle = mapPath[path] ? mapPath[path].title : mapPath['/'].title;

  /* eslint-disable no-multi-spaces */
  /**
   * Javascript compact object representation for the XML LTI configuration.
   * General XML structure/values were taken from:
   * [XML Config Builder](https://www.edu-apps.org/build_xml.html)
   * @type {type}
   */
  const ltiConfigAsCompactJs =
  {
    _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
    cartridge_basiclti_link:
    {
      _attributes:
      {
        xmlns: 'http://www.imsglobal.org/xsd/imslticc_v1p0',
        'xmlns:blti': 'http://www.imsglobal.org/xsd/imsbasiclti_v1p0',
        'xmlns:lticm': 'http://www.imsglobal.org/xsd/imslticm_v1p0',
        'xmlns:lticp': 'http://www.imsglobal.org/xsd/imslticp_v1p0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imslticc_v1p0'
                            + ' http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd'
                            + ' http://www.imsglobal.org/xsd/imsbasiclti_v1p0'
                            + ' http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd'
                            + ' http://www.imsglobal.org/xsd/imslticm_v1p0'
                            + ' http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd'
                            + ' http://www.imsglobal.org/xsd/imslticp_v1p0'
                            + ' http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd'
      },
      'blti:title': { _text: toolTitle },
      'blti:description': { _text: 'Team video conference with social metrics' },
      'blti:icon': {},
      'blti:launch_url': { _text: ltiLaunchUrl },
      'blti:extensions':
      {
        _attributes:
        {
          platform: 'canvas.instructure.com'
        },
        'lticm:property':
        [
          { _attributes: { name: 'tool_id'       }, _text: '6e6f6741-7f1b-4b9c-a1bb-f54cee2d0e47' },
          { _attributes: { name: 'privacy_level' }, _text: 'public' }
        ],
        'lticm:options':
        [
          {
            _attributes: { name: 'resource_selection' },
            'lticm:property':
            [
              { _attributes: { name: 'url'              }, _text: ltiLaunchUrl },
              { _attributes: { name: 'text'             }, _text: toolTitle },
              { _attributes: { name: 'selection_width'  }, _text: '400' },
              { _attributes: { name: 'selection_height' }, _text: '300' },
              { _attributes: { name: 'enabled'          }, _text: 'true' }
            ]
          },
          {
            _attributes: { name: 'course_navigation' },
            'lticm:property':
            [
              { _attributes: { name: 'url'              }, _text: ltiLaunchUrl },
              { _attributes: { name: 'text'             }, _text: toolTitle },
              { _attributes: { name: 'visibility'       }, _text: 'public' },
              { _attributes: { name: 'default'          }, _text: 'enabled' },
              { _attributes: { name: 'windowTarget'     }, _text: '_blank' }, // launch in new window/tab
              { _attributes: { name: 'enabled'          }, _text: 'true' }
            ]
          }
        ]
      },
      cartridge_bundle: { _attributes: { identifierref: 'BLTI001_Bundle' } },
      cartridge_icon: { _attributes: { identifierref: 'BLTI001_Icon' } }
    }
  };
  /* eslint-enable no-multi-spaces */

  return ltiConfigAsCompactJs;
}


// ES6 import compatible export
//        either: import ltiConfig from 'lticonfig';
//            or: import { ltiConfig } from 'lticonfig';
//   or CommonJS: const { ltiConfig } = require('lticonfig');
module.exports =
{
  'default': ltiConfig,
  ltiConfig,
};
