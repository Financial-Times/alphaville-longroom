const userSessionApi = require('../services/userSessionApi');

module.exports = function (req, res, next) {
	const sessionId = req.cookies['FTSession'];
	if (!sessionId) {
		console.log('No session id found');
		req.userUuid = null;
		return next();
	}

	userSessionApi.getSessionData(sessionId).then(sessionData => {
		req.userUuid = sessionData.uuid;

		// fetch whether the user is admin or not

		return next();
	}).catch((err) => {
		req.userUuid = null;
		console.log(err);
		return next();
	});
};
