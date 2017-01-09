"use strict";

const qs = require('querystring');
const fetch = require('node-fetch');
const sudsUserUrl = `https://${process.env.SUDS_API_URL}/v1/user`;

function SudsApiError(message, code, response) {
	this.message = message;
	this.errMsg = message;
	this.errCode = code;
	this.response = response;
}
SudsApiError.prototype = new Error('sudsApi');

exports.getPseudonym = (userIds) => {
	const options = {
		headers: {
			'X-Api-Key': process.env.SUDS_API_KEY
		}
	};

	const url = `${sudsUserUrl}/getPseudonym?userIds=${userIds.join(',')}`;

	return fetch(url, options).then((res) => {
		if (!res.ok) {
			throw new SudsApiError(res.statusText, res.status, res);
		}
		return res.json();
	});
};

exports.setPseudonym = (pseudonym, sessionId) => {
	const options = {
		method: 'POST',
		headers: {
			'X-Api-Key': process.env.SUDS_API_KEY
		}
	};

	const url = `${sudsUserUrl}/setPseudonym?${qs.stringify({pseudonym, sessionId})}`;

	return fetch(url, options).then((res) => {
		if (!res.ok) {
			throw new SudsApiError(res.statusText, res.status, res);
		}
		return res.json();
	});
};
