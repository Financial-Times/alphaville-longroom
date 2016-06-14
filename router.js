'use strict';

const express = require('express');
const router = new express.Router();
const auth = require('alphaville-auth-middleware');

router.use('/', auth());

router.use('/', require('./routes/index'));
router.use('/', require('./routes/discussionsRouter'));
router.use('/content', require('./routes/contentRouter'));
router.use('/join', require('./routes/membershipRouter'));

module.exports = router;
