const express = require('express');
const router = express.Router();

const auth = require('../services/auth');
const userType = require('../enums/userType');
const hasKeys = require('../utils/hasKeys');
const msgBuilder = require('../utils/msgBuilder');
const Post = require('../models/post.js');

// Get list of all posts
router.get('/', auth.check(userType.Admin), (req, res) => {
    Post.find()
        .then((posts) => {
            return msgBuilder.success(res, posts);
        });
});

// Create a Post entry in DB
router.post('/', auth.check(), (req, res) => {
    const check = hasKeys(req.body, ['title', 'body']);
    if (check.length > 0) {
        return msgBuilder.missingFields(res, check);
    }

    const post = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.auth.userId
    });

    post.save()
        .then((savedPost) => {
            return msgBuilder.success(res, savedPost);
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Get a single Post entry by ID
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId).exec()
        .then((post) => {
            if (post === null) {
                return msgBuilder.notFound(res);
            } else {
                return msgBuilder.success(res, post);
            }
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Update a single entry by ID
router.put('/:postId', auth.check(), (req, res) => {
    const check = hasKeys(req.body, ['title', 'body']);
    if (check.length > 0) {
        return msgBuilder.missingFields(res, check);
    }

    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (post == null) {
                msgBuilder.notFound(res);
            } else {
                if (!post.author.equals(req.auth.userId)) {
                    msgBuilder.unauthorized(res, 'You do not have access to this resource');
                } else {
                    post.title = req.body.title;
                    post.body = req.body.body;
                    post.updatedAt = new Date();
                    return post.save();
                }
            }
        })
        .then((post) => {
            if (post != null) {
                return msgBuilder.success(res, post);
            }
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

// Delete a single entry by ID
router.delete('/:postId', auth.check(), (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (post == null) {
                msgBuilder.notFound(res);
            } else {
                if (!post.author.equals(req.auth.userId)) {
                    msgBuilder.unauthorized(res, 'You do not have access to this resource');
                } else {
                    return Post.remove({ _id: post._id }).exec();
                }
            }
        })
        .then((ret) => {
            if (ret != null) {
                return msgBuilder.success(res);
            }
        })
        .catch((err) => {
            return msgBuilder.internalError(res, err);
        });
});

module.exports = router;
