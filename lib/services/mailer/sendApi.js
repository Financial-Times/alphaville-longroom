const fetch = require('node-fetch');

const send = (to, subject, body, textBody) => {
	let reqBody = {
		transmissionHeader: {
			metadata: {
				userUuid: to
			}
		},
		from: {
			address: 'longroom@notice.ft.com',
			name: 'Financial Times Long Room'
		},
		subject: subject,
		htmlContent: body,
		plainTextContent: textBody || body
	};
	let options = {
		method: 'POST',
		headers: {
			'Authorization': process.env['SEND_API_KEY'],
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqBody)
	};
	return fetch(process.env['SEND_API_URL'], options);
};

module.exports = {
	send
};
