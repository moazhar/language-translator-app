const path = require('path');
const winston = require('winston');

module.exports.logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join('log', '/server-info.log'),
      json: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      level: 'error',
      filename: path.join('log', '/server-error.log'),
      json: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});
