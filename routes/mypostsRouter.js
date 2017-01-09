'use strict';

console.log('>>> mypostsRouter: ');

const express = require('express');
const router = new express.Router();
const mypostsCtrl = require('../lib/controllers/myposts');
const updateUserSummaryCtrl = require('../lib/controllers/updateUserSummary');

const userMiddleware = require('../lib/middlewares/user');

router.route('/')
	.get(userMiddleware, mypostsCtrl);

router.route('/update')
	.get(userMiddleware, updateUserSummaryCtrl);

module.exports = router;
