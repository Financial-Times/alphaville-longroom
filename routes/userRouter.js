'use strict';

const router = require('express').Router();
const userCtrl = require('../lib/controllers/user');

router.route('/join')
	.get((req, res) => {
		res.render('joinForm');
	})
	.post(userCtrl.join);

module.exports = router;
