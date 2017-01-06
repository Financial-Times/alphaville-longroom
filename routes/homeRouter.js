'use strict';

const express = require('express');
const router = new express.Router();
const homeCtrl = require('../lib/controllers/home');
const userMiddleware = require('../lib/middlewares/user');

router.get('/', userMiddleware, homeCtrl);

module.exports = router;
