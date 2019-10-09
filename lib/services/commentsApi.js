const fetch = require('node-fetch');

function CommentsApiError(message, code, response) {
	this.statusText = message;
	this.message = message;
	this.errMsg = message;

	this.code = code;
	this.errCode = code;
	this.status = code;

	this.response = response;
}
CommentsApiError.prototype = new Error('commentsApi');

exports.getUser = userId => {
	const options = {
		headers: {
			'X-Api-Key': process.env.COMMENTS_API_KEY
		}
	};

	const url = `${process.env.COMMENTS_API_URL}/user/${userId}`;

	return fetch(url, options).then((res) => {
		if (!res.ok && !(res.status === 404)) {
			throw new CommentsApiError(res.statusText, res.status, res);
		}
		return res.json();
	});
};

exports.getMultipleUsers = userIds => {
	const promises = userIds.map(id => exports.getUser(id));

	return Promise.all(promises)
		.then(responses => {
			return responses.reduce((accumulator, next) => {
				accumulator[next.userId] = next.displayName;
				return accumulator
			}, {});
		});
};
