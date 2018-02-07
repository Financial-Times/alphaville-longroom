'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const checkPseudonymMiddleware = require('./lib/middlewares/checkPseudonym');
const fetchPseudonymMiddleware = require('./lib/middlewares/fetchPseudonym');
const nonMemberPageApprovedUserRedirectMiddleware = require('./lib/middlewares/nonMemberPageApprovedUserRedirect');

router.get('/', auth(), nonMemberPageApprovedUserRedirectMiddleware, require('./routes/index'));
router.use('/home', auth(), checkPseudonymMiddleware, require('./routes/homeRouter'));
router.use('/content', auth(), checkPseudonymMiddleware, require('./routes/contentRouter'));
router.use('/user', auth(), require('./routes/userRouter'));
router.use('/files', checkPseudonymMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', checkPseudonymMiddleware, require('./routes/suggestionRouter'));
router.use('/topic', auth(), checkPseudonymMiddleware, require('./routes/tagsRouter'));
router.use('/author', auth(), checkPseudonymMiddleware, require('./routes/authorRouter'));
router.use('/faq', auth(), checkPseudonymMiddleware, require('./routes/faqRouter'));
router.use('/house-rules', auth(), checkPseudonymMiddleware, require('./routes/houseRulesRouter'));
router.use('/dashboard', auth(), checkPseudonymMiddleware, fetchPseudonymMiddleware, require('./routes/mypostsRouter'));
router.use('/search', auth(), checkPseudonymMiddleware, require('./routes/searchRouter'));
router.use('/admin', auth(), require('./routes/adminRouter'));

module.exports = router;
