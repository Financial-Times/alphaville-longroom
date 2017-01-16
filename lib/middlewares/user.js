const userSessionApi = require('../services/userSessionApi');
const sudsService = require('../services/suds');

module.exports = function (req, res, next) {
	const sessionId = req.cookies['FTSession'];

	if (!sessionId) {
		console.log('No session id found');
		req.userUuid = null;
		return next();
	}

	userSessionApi.getSessionData(sessionId).then(sessionData => {
		req.userUuid = sessionData.uuid;

		// TODO: fetch whether the user is admin or not

		if (req.userUuid) {
			return sudsService.getPseudonym([req.userUuid]).then(data => {
				if (data && data[req.userUuid]) {
					req.userPseudonym = data[req.userUuid];
				}

				next();
			});
		} else {
			return next();
		}
	}).catch((err) => {
		req.userUuid = null;
		console.log(err);
		return next();
	});
};
