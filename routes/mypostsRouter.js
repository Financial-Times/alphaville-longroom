'use strict';

console.log('>>> mypostsRouter: ');

const express = require('express');
const router = new express.Router();
const mypostsCtrl = require('../lib/controllers/myposts');
const updateUserSummaryCtrl = require('../lib/controllers/updateUserSummary');

const userMiddleware = require('../lib/middlewares/user');

router.route('/', userMiddleware, mypostsCtrl)
	.get(userMiddleware, mypostsCtrl);

router.post('/update')
	.get(userMiddleware, updateUserSummaryCtrl);

module.exports = router;
