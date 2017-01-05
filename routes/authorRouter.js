'use strict';

const express = require('express');
const router = new express.Router();
const authorCtrl = require('../lib/controllers/author');

router.get('/:id', authorCtrl);

module.exports = router;
