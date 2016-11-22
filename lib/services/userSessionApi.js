"use strict";

const fetch = require('node-fetch');
const Timer = require('../utils/Timer');

const endTimer = function (timer) {
	const elapsedTime = timer.getElapsedTime();
	if (elapsedTime > 5000) {
		console.warn('userSessionApi.getSessionData: service high response time', elapsedTime + 'ms');
	} else {
		console.info('userSessionApi.getSessionData: service response time', elapsedTime + 'ms');
	}
};

function UserSessionApiError(message, code) {
	this.errMsg = message;
	this.code = code;
}
UserSessionApiError.prototype = new Error('sessionApi');

const sessionApiUrl = process.env['SESSION_API_URL'];
const sessionApiKey = process.env['SESSION_API_KEY'];

const getSessionData = (sessionId) => {
	const options = {
		headers: {
			'X-Api-Key': sessionApiKey
		}
	};

	const url = sessionApiUrl + sessionId;

	const timer = new Timer();

	return fetch(url, options).then((res) => {
		endTimer(timer);
		if (res.status === 404) {
			res.statusText = 'User not Found';
		}
		if (res.status !== 200) {
			throw new UserSessionApiError(res.statusText, res.status);
		}
		return res.json();
	});
};

module.exports = {
	getSessionData
};
