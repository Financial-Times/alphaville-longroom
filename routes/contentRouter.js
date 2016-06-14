'use strict';

const express = require('express');
const router = new express.Router();

router.route('/test').
	get((req, res) => {
		res.send('test content');
	});

module.exports = router;
