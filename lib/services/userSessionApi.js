"use strict";

const fetch = require('node-fetch');
const Timer = require('../utils/Timer');
const _ = require('lodash');

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

		if (res.status < 200 || res.status >= 400) {
			if (res.status !== 404) {
				console.warn(sessionId, 'sessionAPI error', new Error(res.status));
			}

			throw {
				statusCode: res.status,
				error: res.status === 404 ? new Error("Not found") : null
			};
		}

		return res.json();
	}).then((json) => {
		if (json) {
			const responseBody = _.pick(json, ['uuid', 'creationTime', 'rememberMe']);
			return responseBody;
		} else {
			throw {
				statusCode: 503,
				error: new Error("Unexpected response.")
			};
		}
	}).catch((err) => {
		throw {
			statusCode: err.statusCode || 503,
			error: err instanceof Error ? err : (err.error ? err.error : new Error("Unexpected response"))
		};
	});
};
