'use strict';

const router = require('express').Router();
const userCtrl = require('../lib/controllers/user');
const userFormValidator = require('../lib/middlewares/userFromValidator');
const nonMemberPageApprovedUserRedirectMiddleware = require('../lib/middlewares/nonMemberPageApprovedUserRedirect');

router.route('/applied')
	.use(nonMemberPageApprovedUserRedirectMiddleware)
	.get(userCtrl.applied);

router.route('/join')
	.use(nonMemberPageApprovedUserRedirectMiddleware)
	.get(userCtrl.get)
	.post(userFormValidator(), userCtrl.join);

router.route('/setpseudonym')
	.get(userCtrl.getSetPseudonymForm)
	.post(userCtrl.setPseudonym);

module.exports = router;
