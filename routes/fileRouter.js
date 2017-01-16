'use strict';

const express = require('express');
const router = new express.Router();
const fileCtrl = require('../lib/controllers/file');
const auth = require('alphaville-auth-middleware');

router.get('/sign', auth(), fileCtrl.sign);
router.post('/delete', auth(), fileCtrl.delete);
router.route('/attachment/:filePath').get(fileCtrl.oldAttachments);
router.route('/:fileName').get(fileCtrl.download);

module.exports = router;
