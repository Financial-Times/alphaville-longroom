'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');
const userMiddleware = require('./lib/middlewares/user');

router.use('/', auth());

router.use('/', require('./routes/index'));
router.use('/', require('./routes/discussionsRouter'));
router.use('/content', require('./routes/contentRouter'));
router.use('/user', userMiddleware, require('./routes/userRouter'));

module.exports = router;
