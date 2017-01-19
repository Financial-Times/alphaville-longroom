'use strict';

const express = require('express');
const router = new express.Router();
const searchCtrl = require('../lib/controllers/search');

router.get('/', searchCtrl);

module.exports = router;
