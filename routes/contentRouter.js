'use strict';

const express = require('express');
const router = new express.Router();
const controllers = {
	create: require('../lib/controllers/create'),
	view: require('../lib/controllers/view')
};

router.get('/write-post', controllers.create.getWriteAPostForm);
router.get('/upload-document', controllers.create.getUploadDocumentForm);
router.post('/create', controllers.create.post);

router.route('/:id').get(controllers.view);

module.exports = router;

module.exports = router;
