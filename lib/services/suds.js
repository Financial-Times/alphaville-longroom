"use strict";

const Timer = require('../utils/Timer');

const endTimer = function (timer, serviceName, id) {
	const elapsedTime = timer.getElapsedTime();
	if (elapsedTime > 5000) {
		console.warn(id ? id : '', 'suds.'+ serviceName +': service high response time', elapsedTime + 'ms');
	} else {
		console.info(id ? id : '', 'suds.'+ serviceName +': service response time', elapsedTime + 'ms');
	}
};


function SudsApiError(message, code, response) {
	this.message = message;
	this.errMsg = message;
	this.errCode = code;
	this.response = response;
}
SudsApiError.prototype = new Error('sudsApi');

exports.getPseudonym = function (userIds) {
	const options = {
		headers: {
			'X-Api-Key': process.env.SUDS_API_KEY
		}
	};

	const url = process.env.SUDS_API_URL + '?userIds=' + userIds.join(',');

	const timer = new Timer();

	return fetch(url, options).then((res) => {
		endTimer(timer);
		if (!res.ok) {
			throw new SudsApiError(res.statusText, res.status, res);
		}
		return res.json();
	});
};
