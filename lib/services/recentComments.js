"use strict";

const fetch = require('node-fetch');
const apiUrl = `https://${process.env.RECENT_COMMENTS_API_URL}/v1/recent-comments`;
const defaultSiteId = process.env.COMMENTS_DEFAULT_SITE_ID;

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

exports.get = (tagName, count) => {
	tagName = tagName || 'longroom';
	count = count || 10;

	const url = `${apiUrl}?siteid=${defaultSiteId}&tagname=${tagName}&count=${count}`;

	return fetch(url).then((res) => {
		if (!res.ok) {
			throw new RecentCommentsApiError(res.statusText, res.status, res);
		}
		return res.json();
	});
};
