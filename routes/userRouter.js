'use strict';

const router = require('express').Router();
const userCtrl = require('../lib/controllers/user');
const userFormValidator = require('../lib/middlewares/userFromValidator');
const nonMemberPageApprovedUserRedirectMiddleware = require('../lib/middlewares/nonMemberPageApprovedUserRedirect');

router.route('/applied')
	.get(nonMemberPageApprovedUserRedirectMiddleware, userCtrl.applied);

router.route('/join')
	.get(nonMemberPageApprovedUserRedirectMiddleware, userCtrl.get)
	.post(nonMemberPageApprovedUserRedirectMiddleware, userFormValidator(), userCtrl.join);

module.exports = router;
