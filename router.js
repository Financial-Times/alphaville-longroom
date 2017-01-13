'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const userMiddleware = require('./lib/middlewares/user');
const checkPseudonymMiddleware = require('./lib/middlewares/checkPseudonym');


router.use('/', auth(), userMiddleware, require('./routes/index'));
router.use('/home', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/homeRouter'));
router.use('/content', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/contentRouter'));
router.use('/user', auth(), userMiddleware, require('./routes/userRouter'));
router.use('/files', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', userMiddleware, checkPseudonymMiddleware, require('./routes/suggestionRouter'));
router.use('/topic', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/tagsRouter'));
router.use('/author', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/authorRouter'));
router.use('/faq', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/faqRouter'));
router.use('/house-rules', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/houseRulesRouter'));
router.use('/dashboard', auth(), userMiddleware, checkPseudonymMiddleware, require('./routes/mypostsRouter'));

module.exports = router;
