'use strict';

const express = require('express');
const router = new express.Router();
const fileCtrl = require('../lib/controllers/file');

router.get('/sign', fileCtrl.sign);
router.post('/delete', fileCtrl.delete);
router.route('/attachment/:filePath').get(fileCtrl.oldAttachments);
router.route('/:fileName').get(fileCtrl.download);

module.exports = router;
