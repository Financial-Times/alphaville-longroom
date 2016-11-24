'use strict';

const express = require('express');
const router = new express.Router();
const s3Ctrl = require('../lib/controllers/s3');

router.get('/sign', s3Ctrl.sign);
router.post('/delete', s3Ctrl.delete);

module.exports = router;
