'use strict';

const router = require('express').Router();
const controllers = {
	create: require('../lib/controllers/create')
};

router.route('/').
	get(controllers.create.get).
	post(controllers.create.post);

module.exports = router;
