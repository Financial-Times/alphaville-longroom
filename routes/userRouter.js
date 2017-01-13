'use strict';

const router = require('express').Router();
const userCtrl = require('../lib/controllers/user');
const userFormValidator = require('../lib/middlewares/userFromValidator');

router.route('/applied')
	.get(userCtrl.applied);

router.route('/join')
	.get(userCtrl.get)
	.post(userFormValidator(), userCtrl.join);

router.route('/setpseudonym')
	.get(userCtrl.getSetPseudonymForm)
	.post(userCtrl.setPseudonym);

module.exports = router;
