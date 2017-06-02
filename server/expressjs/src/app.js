const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const logger = require('./utils/logger');
const config = require('./config/config');
const msgBuilder = require('./utils/msgBuilder');
const routes = require('./routes/config');
const auth = require('./services/auth');

const app = express();
app.use(morgan('combined', {stream: logger.stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise;
mongoose.connect(config.db.getConnectionString());

// Set Up Auth Middleware
app.use(auth.use());

// Set Up Routes
routes(app);

// API Not Found
app.use((req, res, next) => {
    return msgBuilder.badRequest(res, 'Invalid API Path');
});

// Error
app.use((err, req, res, next) => {
    logger.error(err.stack);
    return msgBuilder.internalError(res, err);
});

module.exports = app;
