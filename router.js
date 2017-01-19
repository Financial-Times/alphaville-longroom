'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const checkPseudonymMiddleware = require('./lib/middlewares/checkPseudonym');


router.get('/',  auth(), require('./routes/index'));
router.use('/home', auth(), checkPseudonymMiddleware, require('./routes/homeRouter'));
router.use('/content', auth(), checkPseudonymMiddleware, require('./routes/contentRouter'));
router.use('/user', auth(), require('./routes/userRouter'));
router.use('/files', checkPseudonymMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', checkPseudonymMiddleware, require('./routes/suggestionRouter'));
router.use('/topic', auth(), checkPseudonymMiddleware, require('./routes/tagsRouter'));
router.use('/author', auth(), checkPseudonymMiddleware, require('./routes/authorRouter'));
router.use('/faq', auth(), checkPseudonymMiddleware, require('./routes/faqRouter'));
router.use('/house-rules', auth(), checkPseudonymMiddleware, require('./routes/houseRulesRouter'));
router.use('/dashboard', auth(), checkPseudonymMiddleware, require('./routes/mypostsRouter'));
router.use('/search', auth(), checkPseudonymMiddleware, require('./routes/searchRouter'));

module.exports = router;
