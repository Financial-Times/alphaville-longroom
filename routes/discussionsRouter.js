'use strict';

const express = require('express');
const router = new express.Router();
const controllers = {
	create: require('../lib/controllers/create'),
	view: require('../lib/controllers/view')
};

router.route('/create').
	get(controllers.create.get).
	post(controllers.create.post);

router.route('/discussion/:id').get(controllers.view);

module.exports = router;
