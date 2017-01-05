const _ = require('lodash');

module.exports = function (req, res, next) {
	res.setFlashMessage = function (type, message) {
		res.cookie('flashMessageType', type);
		res.cookie('flashMessage', message);
	};

	const _render = res.render;
	res.render = function( view, options, fn ) {
		options = options || {};

		if (req.cookies.flashMessage) {
			_.merge(options, {
				flashMessage: {
					type: req.cookies.flashMessageType || 'success',
					msg: req.cookies.flashMessage
				}
			});
		}

		_render.call(this, view, options, fn);
	};

	if (req.cookies.flashMessage) {
		req.flashMessage = req.cookies.flashMessage;

		res.clearCookie('flashMessage');
	}

	next();
};
