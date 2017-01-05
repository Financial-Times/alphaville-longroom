'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const userMiddleware = require('./lib/middlewares/user');

router.use('/', auth(), require('./routes/index'));
router.use('/home', auth(), require('./routes/homeRouter'));
router.use('/content', auth(), require('./routes/contentRouter'));
router.use('/user', auth(), userMiddleware, require('./routes/userRouter'));
router.use('/files', auth(), userMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', require('./routes/suggestionRouter'));
router.use('/topic', auth(), require('./routes/tagsRouter'));
router.use('/author', auth(), require('./routes/authorRouter'));

module.exports = router;
