"use strict";

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

exports.getSessionData = function (sessionId) {
	const options = {
		headers: {
			'FT_Api_Key': process.env.SESSION_API_KEY
		}
	};

	let url = process.env.SESSION_API_URL;
	url = url.replace(/\{sessionId\}/g, sessionId);

	const timer = new Timer();

	return fetch(url, options).then((res) => {
		endTimer(timer);

		if (!res.ok) {
			const error = new Error(res.statusText);
			error.response = res;
			throw error;
		}

		return res.json();
	});
};
