'use strict';

const express = require('express');
const router = new express.Router();
const fileCtrl = require('../lib/controllers/file');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100 * 1024 * 1024
	}
});

router.post('/upload', upload.single('file'), fileCtrl.upload);
router.post('/delete', fileCtrl.delete);
router.route('/attachment/*').get(fileCtrl.oldAttachments);
router.route('/:fileName').get(fileCtrl.download);

module.exports = router;
