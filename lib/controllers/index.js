"use strict";

module.exports = function (req, res) {
	if (req.userData) {
		if (req.userData.status === 'pending') {
			return res.render('nonMemberMessage', {
				message: `
					<p>Thanks for applying to the Long Room.</p>
					<p>We have received your request and will be dealing with it as soon as we can but it might take a day or two.</p>
					<p>If you have any question please get in touch via <a href="mailto:alphaville@ft.com">alphaville@ft.com</a>.</p>
					<p>The FTAV team</p>
				`
			});
		}

		if (req.userData.status === 'revoked') {
			return res.render('nonMemberMessage', {
				message: 'Your access has been suspended.<br/>If you have any questions, please email us at <a href="mailto:alphaville@ft.com">alphaville@ft.com</a>'
			});
		}
	}

	res.render('index', {
		title: 'Long Room | FT Alphaville',
		subtitle: 'In depth comment and analysis'
	});
};
