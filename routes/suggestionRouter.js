'use strict';

const express = require('express');
const router = new express.Router();
const suggestionCtrl = require('../lib/controllers/suggestion');

router.get('/tags', suggestionCtrl.tags);

module.exports = router;
