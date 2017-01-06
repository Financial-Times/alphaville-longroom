'use strict';

const express = require('express');
const router = new express.Router();
const controllers = {
	create: require('../lib/controllers/create'),
	view: require('../lib/controllers/view'),
	delete: require('../lib/controllers/delete'),
	edit: require('../lib/controllers/edit')
};
const userMiddleware = require('../lib/middlewares/user');

router.get('/write-post', userMiddleware, controllers.create.getWriteAPostForm);
router.get('/upload-document', userMiddleware, controllers.create.getUploadDocumentForm);
router.post('/create', userMiddleware, controllers.create.post);

router.route('/:id')
	.get(userMiddleware, controllers.view);

router.route('/:id/delete').get(userMiddleware, controllers.delete);
router.route('/:id/edit').get(userMiddleware, controllers.edit.getForm);
router.route('/:id/edit').post(userMiddleware, controllers.edit.process);

module.exports = router;
