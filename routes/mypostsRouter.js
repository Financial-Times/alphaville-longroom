'use strict';

const express = require('express');
const router = new express.Router();
const mypostsCtrl = require('../lib/controllers/myposts');
const updateUserSummaryCtrl = require('../lib/controllers/updateUserSummary');

router.route('/', mypostsCtrl)
	.get(mypostsCtrl);

router.post('/update', updateUserSummaryCtrl);

module.exports = router;
