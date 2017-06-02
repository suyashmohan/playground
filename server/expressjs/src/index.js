const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('error', function (error) {
    logger.error(error);
});

server.on('listening', function () {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logger.info(`Listening on ${bind}`);
});
