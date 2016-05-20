const userSessionApi = require('../services/userSessionApi');

module.exports = function (req, res, next) {
	const sessionId = req.cookies['FTSession'];
	if (!sessionId) {
		req.userUuid = null;
		next();
	}

	userSessionApi.getSessionData(sessionId).then(sessionData => {
		req.userUuid = sessionData.uuid;
		next();
	}).catch((err) => {
		console.log(err);
		req.userUuid = null;
		next();
	});
};
