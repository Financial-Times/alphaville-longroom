'use strict';

console.log('>>> mypostsRouter: ');

const express = require('express');
const router = new express.Router();
const mypostsCtrl = require('../lib/controllers/myposts');

const userMiddleware = require('../lib/middlewares/user');

router.route('/')
	.get(userMiddleware, mypostsCtrl);


module.exports = router;
