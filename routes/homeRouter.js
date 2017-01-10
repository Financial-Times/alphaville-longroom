'use strict';

const express = require('express');
const router = new express.Router();
const homeCtrl = require('../lib/controllers/home');

router.get('/', homeCtrl);

module.exports = router;
