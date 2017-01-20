const userSessionApi = require('../services/userSessionApi');
const db = require('../services/db').db;

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
