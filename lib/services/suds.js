"use strict";

const qs = require('querystring');
const fetch = require('node-fetch');
const sudsUserUrl = `https://${process.env.SUDS_API_URL}/v1/user`;

function SudsApiError(message, code, response) {
	this.statusText = message;
	this.message = message;
	this.errMsg = message;

	this.code = code;
	this.errCode = code;
	this.status = code;

	this.response = response;
}
SudsApiError.prototype = new Error('sudsApi');

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
