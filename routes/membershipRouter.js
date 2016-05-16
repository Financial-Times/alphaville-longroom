'use strict';

const router = require('express').Router();
const userSessionApi = require('../lib/services/userSessionApi');

router.route('/').
	get((req, res) => {
		let sessionId = req.cookies['FTSession'];
		if ( !sessionId ) {
			return res.render('error', {message: 'Invalid session'});
		}
		userSessionApi.getSessionData(sessionId).
			then(sessionData => {
				res.render('joinForm');
			}).catch(console.log);
	});

module.exports = router;
