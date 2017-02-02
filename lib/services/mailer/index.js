const _ = require('lodash');
const fs = require('fs');
const sendApi = require('./sendApi');

const htmlTemplate = fs.readFileSync('./lib/services/mailer/lr-mail-template.html', 'utf8');
let htmlCompiled = _.template(htmlTemplate);

const sendMail = (to, body) => {
	return sendApi.send(process.env['TEST_UUID'], 'alphaville longroom', body)
		.then(res => {
			if (res.ok === true) {
				return res.json();
			}
			return Promise.reject(res.statusText);
		});
};

const sendApproved = (to) => {
	const emailBody = `
		<h4>Thank you for your application to join Long Room</h4>
		<p>Congratulations, your application has been successful and you can now access Long Room content.</p>
	`;
	const model = { emailBody };
	return sendMail(to, htmlCompiled(model));
};

const sendRejected = (to) => {
	const emailBody = `
		<h4>Thank you for your application to join Long Room</h4>
		<p>We regret to inform you that your application has been unsuccessful, as you don't appear to meet our strict criteria for membership.<p>
	`;
	const model = { emailBody };
	return sendMail(to, htmlCompiled(model));
};

module.exports = {
	sendApproved,
	sendRejected
};
