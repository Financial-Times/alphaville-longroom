"use strict";

const fetch = require('node-fetch');

function RecentCommentsApiError(message, code, response) {
	this.statusText = message;
	this.message = message;
	this.errMsg = message;

	this.code = code;
	this.errCode = code;
	this.status = code;

	this.response = response;
}
RecentCommentsApiError.prototype = new Error('recentCommentsApi');

exports.get = () => {
	return fetch(process.env.RECENT_COMMENTS_API_URL, {
		headers: {
			'x-api-key': process.env.COMMENTS_API_KEY
		}
	}).then((res) => {
		if (!res.ok) {
			throw new RecentCommentsApiError(res.statusText, res.status, res);
		}
		return res.json();
	})
		.then(json => json.recentComments);
};
