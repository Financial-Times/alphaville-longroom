'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const userMiddleware = require('./lib/middlewares/user');

router.use('/', auth());

router.use('/', require('./routes/index'));
router.use('/content', require('./routes/contentRouter'));
router.use('/user', userMiddleware, require('./routes/userRouter'));
router.use('/files', userMiddleware, require('./routes/fileRouter'));
router.use('/suggestions', require('./routes/suggestionRouter'));

module.exports = router;
