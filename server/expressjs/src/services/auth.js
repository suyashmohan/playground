const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const config = require('../config/config');
const msgBuilder = require('../utils/msgBuilder');

const Auth = {
    // Middleware for Express to check and Inject Auth User
    use: () => {
        return (req, res, next) => {
            if (req.headers['x-auth-token'] !== undefined) {
                try {
                    const token = req.headers['x-auth-token'];
                    const payload = jwt.verify(token, config.secret);
                    req.auth = payload;
                } catch (e) {
                    logger.error(e);
                }
            }

            next();
        };
    },

    // Middleware for checking Is User logged In
    check: (usertype) => {
        return (req, res, next) => {
            if (req.auth === undefined || req.Auth === null) {
                return msgBuilder.unauthorized(res);
            } else if (usertype !== undefined && req.auth.type !== usertype) {
                return msgBuilder.forbidden(res);
            } else {
                next();
            }
        };
    },

    // Sign and Create a JWT Token
    sign: (userId, userType) => {
        return jwt.sign({
            userId: userId,
            type: userType
        }, config.secret, { expiresIn: config.tokenExpiry });
    }
};

module.exports = Auth;
