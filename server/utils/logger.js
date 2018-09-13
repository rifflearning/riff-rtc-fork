/* ******************************************************************************
 * logger.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview [summary of file contents]
 *
 * [More detail about the file's contents]
 *
 * Created on       September 13, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Michael Jay Lippert,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

const bunyan = require('bunyan');
const config = require('config');

/* **************************************************************************
 * createLogger                                                        */ /**
 *
 * [Description of createLogger]
 *
 * @returns a new bunyan logger initialized with the log settings from config.
 *
 * **************************************************************************/
function createLogger()
{
  // Parse out the log config and create streams:
  const logConfig = config.get('server.log');

  const defaultLevel = logConfig.level || 'info';
  const logStreams = [];

  const processLogStream = (stream, index) =>
  {
    const logLevel = stream.level || defaultLevel;

    if (stream.output === 'file')
    {
      // @todo: If you specify a directory within your config that does not
      // yet exist the app will throw an error...fix that.
      let logDir = stream.logDir || './';
      if (!/\/$/.test(logDir))
      {
        logDir += '/';
      }

      const adjustedStream =
        {
          level: logLevel,
          type: stream.type || 'rotating-file',   // Defaults to rotating file
          path: `${logDir}${logConfig.name}.log`,
          period: stream.period || '1d',          // Defaults to daily rotation
          count: stream.count || 10,              // defaults to 10 files back-copy window
        };

      logStreams.push(adjustedStream);
    }
    else if (stream.output === 'stderr' || stream.output === 'stdout')
    {
      logStreams.push(
        {
          level: logLevel,
          stream: process[stream.output]
        });
    }
    // Possibly add other output types such as logstash
    else
    {
      console.log(`Logger warning: unrecognized configuration value log.streams[${index}].type`);
    }
  };

  logConfig.streams.forEach(processLogStream);


  if (logStreams.length === 0)
  {
    const errorMessage = 'Logger warning: no stream attached to the logger!';
    console.log(errorMessage);
    throw Error(errorMessage);
  }

  // Create the logger with the streams configured above
  const bunyanLoggerConfig =
    {
      name:    logConfig.name,
      level:   defaultLevel,
      streams: logStreams,
      serializers:
      {
        req: expressReqSerializer,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err,
      },
    };

  return bunyan.createLogger(bunyanLoggerConfig);
}

/* **************************************************************************
 * expressReqSerializer                                                */ /**
 *
 * Bunyan serializer for an express req (request) object.
 *
 * This was taken from https://github.com/parshap/bunyan-express-serializer/blob/master/index.js
 * ---- from that repo's readme: ----
 * Serialize Express-like request objects.
 *
 * This Bunyan serializer behaves like Bunyan's built-in req serializer, but
 * handles the differences between the Node core req object
 * (http.IncomingMessage) and the Express req object. Specifically, it adds
 * logging of req.originalUrl.
 *
 * See [node-bunyan#169](https://github.com/trentm/node-bunyan/pull/169) for
 * motivation.
 * ----
 */
function expressReqSerializer(req)
{
  // Start off with Bunyan's built-in req serializer
  var serialized = bunyan.stdSerializers.req(req);

  // If originalUrl isn't being used, we don't need to do anything different
  // than the built-in req serializer
  if (req.originalUrl === null || req.url === req.originalUrl)
  {
    return serialized;
  }

  if (serialized === req)
  {
    // Don't modify the original object
    serialized = { ...serialized };
  }

  // Use originalUrl instead of url
  serialized.url = req.originalUrl;
  return serialized;
}

// Singleton Logger instance
const loggerInstance = createLogger();


/* ******************************************************************************
 * Module exports
 *
 * const { loggerInstance: logger } = require('./utils/logger');
 * or
 * import { loggerInstance as logger } from './utils/logger';
 * or
 * import logger from './utils/logger';
 */
module.exports =
{
  default: loggerInstance,
  loggerInstance,
};
