'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const userMiddleware = require('./lib/middlewares/user');

router.use('/', auth(), userMiddleware, require('./routes/index'));
router.use('/home', auth(), userMiddleware, require('./routes/homeRouter'));
router.use('/content', auth(), require('./routes/contentRouter'));
router.use('/user', auth(), userMiddleware, require('./routes/userRouter'));
router.use('/files', auth(), userMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', require('./routes/suggestionRouter'));
router.use('/topic', auth(), userMiddleware, require('./routes/tagsRouter'));
router.use('/author', auth(), userMiddleware, require('./routes/authorRouter'));
router.use('/faq', auth(), require('./routes/faqRouter'));
router.use('/house-rules', auth(), require('./routes/houseRulesRouter'));
router.use('/myposts', auth(), userMiddleware, require('./routes/mypostsRouter'));

module.exports = router;
