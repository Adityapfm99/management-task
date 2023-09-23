const expressWinston = require('express-winston');
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

const expressLogger = expressWinston.logger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'http.log' }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

module.exports = { logger, expressLogger };
