const _ = require('lodash');
const { createLogger, transports, format } = require('winston');
process.setMaxListeners(0);

class Logger {
  constructor(requestId = null) {
    this.requestId = requestId;
  }

  customFormatter() {
    return format((info) => {
      const { message } = info;
      const args = info[Symbol.for('splat')];
      const strArgs = (args || []).map((arg) => arg).join(' ');
      info.message = `${message} ${strArgs}`;
      return info;
    })();
  }

  /*
    Winston logger configuration for console transport
  */
  log() {
    return createLogger({
      defaultMeta: {
        requestId: this.requestId,
        application: process.env.APP_NAME,
      },
      format: format.combine(
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        format.prettyPrint(),
        format.json(),
        this.customFormatter(),
        format.printf((info) => {
          const timestamp = info.timestamp.trim();
          const requestId = info.requestId;
          const level = info.level;
          const message = (info.message || '').trim();
          if (_.isNull(requestId) || _.isUndefined(requestId)) {
            return `${timestamp} ${level}: ${message}`;
          } else {
            return `${timestamp} ${level}: processing with requestId [${requestId}]: ${message}`;
          }
        }),
      ),
      transports: [
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
        }),
      ],
    });
  }
}

module.exports = new Logger().log();