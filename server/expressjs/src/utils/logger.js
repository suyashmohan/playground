const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: './logs/logs.log',
            maxsize: 52428800, // 50 MB
            maxFiles: 5,
            json: false
        })
    ]
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};

module.exports = logger;
