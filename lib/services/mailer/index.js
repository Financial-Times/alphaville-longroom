const _ = require('lodash');
const fs = require('fs');
const sendApi = require('./sendApi');

const htmlTemplate = fs.readFileSync('./lib/services/mailer/lr-mail-template.html', 'utf8');
let htmlCompiled = _.template(htmlTemplate);

const sendMail = (to, body) => {
	to = to || process.env['TEST_UUID'];
	return sendApi.send(to, ' FT Long Room', body)
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
		<p>Tip : If you are currently logged into FT.com, you may need to sign out and sign in again to update your account.</p>
		<p>We hope you enjoy your membership.</p>
		<p>For more information about how the Long Room operates, please visit our <a href="https://ftalphaville.ft.com/longroom/faq">FAQ</a></p>
		<p>If you have any questions, please email us at <a href="mailto:alphaville@ft.com">alphaville@ft.com</a>. We will do our best to respond to you within in a day or two.</p>
	`;
	const model = { emailBody };
	return sendMail(to, htmlCompiled(model));
};

const sendRejected = (to) => {
	const emailBody = `
		<h4>Oh no!</h4>
		<p>We regret to inform you that your application to join the Long Room at FT Alphaville has been unsuccessful.</p>
		<p><strong>But don't panic.</strong> This is probably just a technicality. You may have left holes in the application form or someone at our end might have clicked the wrong button.</p>
		<p>Either way, if you think you should qualify for membership, just ping us an email: <a href="mailto:alphaville@ft.com">alphaville@ft.com</a></p>
		<p>On the other hand, if you are a troll we've probably spotted that you're a troll. In which case go and be a troll somewhere else.</p>
		<p><strong>Team FTAV</strong></p>
	`;


	const model = { emailBody };
	return sendMail(to, htmlCompiled(model));
};

module.exports = {
	sendApproved,
	sendRejected
};
