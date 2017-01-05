'use strict';

const express = require('express');
const router = new express.Router();
const tagsCtrl = require('../lib/controllers/tags');

router.get('/:id', tagsCtrl);

module.exports = router;
