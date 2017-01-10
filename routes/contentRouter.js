'use strict';

const express = require('express');
const router = new express.Router();
const controllers = {
	create: require('../lib/controllers/create'),
	view: require('../lib/controllers/view'),
	delete: require('../lib/controllers/delete'),
	edit: require('../lib/controllers/edit')
};

router.get('/write-post', controllers.create.getWriteAPostForm);
router.get('/upload-document', controllers.create.getUploadDocumentForm);
router.post('/create', controllers.create.post);

router.route('/:id')
	.get(controllers.view);

router.route('/:id/delete').get(controllers.delete);
router.route('/:id/edit').get(controllers.edit.getForm);
router.route('/:id/edit').post(controllers.edit.process);

module.exports = router;
