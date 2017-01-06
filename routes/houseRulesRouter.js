'use strict';

const express = require('express');
const router = new express.Router();
const houseRulesCtrl = require('../lib/controllers/wpStaticCtrl')('house-rules', 'longroom-house-rules', 'long.room', 'Long Room');

router.get('/', houseRulesCtrl);

module.exports = router;
