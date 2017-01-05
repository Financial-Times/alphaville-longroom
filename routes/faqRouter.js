'use strict';

const express = require('express');
const router = new express.Router();
const faqCtrl = require('../lib/controllers/wpStaticCtrl')('faq', 'longroom-faq', 'long.room', 'Long Room');

router.get('/', faqCtrl);

module.exports = router;
