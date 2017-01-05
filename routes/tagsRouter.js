'use strict';

const express = require('express');
const router = new express.Router();
const tagsCtrl = require('../lib/controllers/tags');

router.get('/:name', tagsCtrl);

module.exports = router;
