const userSessionApi = require('../services/userSessionApi');
const db = require('../services/db').db;
const _ = require('lodash');

module.exports = function (req, res, next) {
	const sessionId = req.cookies['FTSession'];

	if (!sessionId) {
		return next();
	}

	userSessionApi.getSessionData(sessionId).then(sessionData => {
		// TODO: fetch whether the user is admin or not

		if (sessionData && sessionData.uuid) {
			req.userData = {
				user_id: sessionData.uuid
			};

			return db.user.find(sessionData.uuid).then(user => {
				if (user) {
					req.userData = user;

					if (req.userData.is_editor) {
						const _render = res.render;
						res.render = function( view, options, fn ) {
							options = options || {};

							_.merge(options, {
								isAdmin: true
							});

							_render.call(this, view, options, fn);
						};
					}
				}

				next();
			});
		} else {
			return next();
		}
	}).catch((err) => {
		console.log(err.errMsg || err.message);
		return next();
	});
};
