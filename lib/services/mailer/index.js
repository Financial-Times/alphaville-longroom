const _ = require('lodash');
const fs = require('fs');
const sendApi = require('./sendApi');
const moment = require('moment-timezone');

const htmlTemplate = fs.readFileSync('./lib/services/mailer/lr-mail-template.html', 'utf8');
let htmlCompiled = _.template(htmlTemplate);

const year = moment().format('YYYY');

const sendMail = (to, body) => {
	to = process.env['TEST_UUID'] || to;
	return sendApi.send(to, ' FT Long Room', body)
		.then(res => {
			if (res.ok === true) {
				return res.json();
			}
			return Promise.reject(res.statusText);
		});
};

const appUrl = process.env['APP_URL'];

const sendApproved = (to) => {
	const emailBody = `
		<h4>You're in!</h4>
		<p>One last step: if you are currently logged in to <a href="https://ft.com">FT.com</a>, you will need to sign out and then sign back in again to update your account.</p>
		<p>Then have a click around the <a href="https://ftalphaville.ft.com/longroom">Long Room</a>.</p>
		<p>You'll find a growing library of quality investment research and hopefully a few conversations of note amongst our elite membership.</p>
		<p>Go ahead and upload your own documents, write your own post or comment on the work of others. For a guide on how the Long Room operates, have a read of our <a href="https://ftalphaville.ft.com/longroom/faq">FAQs</a></p>
		<p><strong>The Long Room is not indexed by Google or any other public search engine, so the content is not out there on the wild web. This corner of Alphaville is just for accredited finance professionals -- so we'd appreciate you treating what you find here with discretion. (ie. Don't do daft things like sharing Long Room links on stupid Twitter.)</strong></p>
		<p>Otherwise, enjoy your membership!</p>
		<p>Any questions or problems, ping us an email: <a href="mailto:alphaville@ft.com">alphaville@ft.com</a>.</p>
		<p><strong>Team FTAV</strong></p>
	`;
	const model = { emailBody, year, appUrl };
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
	const model = { emailBody, year, appUrl };
	return sendMail(to, htmlCompiled(model));
};

module.exports = {
	sendApproved,
	sendRejected
};
