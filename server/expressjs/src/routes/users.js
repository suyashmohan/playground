const express = require('express');
const router = express.Router();

const hasKeys = require('../utils/hasKeys');
const msgBuilder = require('../utils/msgBuilder');
const pswdCrypt = require('../utils/passwordCrypt');
const auth = require('../services/auth.js');
const userType = require('../enums/userType');
const User = require('../models/user');

// Get list of all Users
router.get('/', auth.check(userType.Admin), (req, res) => {
    User.find({}, { password: 0 })
        .then((posts) => {
            return msgBuilder.success(res, posts);
        });
});

// Create a User entry in DB
router.post('/register', (req, res) => {
    const check = hasKeys(req.body, ['name', 'email', 'password']);
    if (check.length > 0) {
        return msgBuilder.missingFields(res, check);
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: pswdCrypt.create(req.body.password)
    });

    user.save()
        .then((savedUser) => {
            const userResponse = user.toObject();
            delete userResponse.password;
            return msgBuilder.success(res, userResponse);
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Authorize the User Credentials
router.post('/authorize', (req, res) => {
    const check = hasKeys(req.body, ['email', 'password']);
    if (check.length > 0) {
        return msgBuilder.missingFields(res, check);
    }

    User.findOne({ email: req.body.email }).exec()
        .then((user) => {
            if (user == null) {
                return msgBuilder.notFound(res);
            } else {
                const authenticated = pswdCrypt.compare(req.body.password, user.password);
                if (authenticated === true) {
                    const token = auth.sign(user.id, user.userType);
                    const userResponse = { token };
                    return msgBuilder.success(res, userResponse);
                } else {
                    return msgBuilder.notFound(res, 'Password does not match');
                }
            }
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Get a single User entry by ID
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findById(userId, { password: 0 }).exec()
        .then((user) => {
            if (user == null) {
                return msgBuilder.notFound(res);
            } else {
                return msgBuilder.success(res, user);
            }
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Delete a single entry by ID
router.delete('/:userId', auth.check(userType.Admin), (req, res) => {
    const userId = req.params.userId;
    User.remove({ _id: userId }).exec()
        .then(() => {
            return msgBuilder.success(res);
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

module.exports = router;
