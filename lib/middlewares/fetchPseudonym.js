const commentsApi = require('../services/commentsApi');
const temporaryDisplayNameApi = require('../services/temporaryDisplayNameApi');

module.exports = async function (req, res, next) {
	if (req.userData) {
		if (!req.userData.pseudonym) {
			try {
				const data = await commentsApi.getUser(req.userData.user_id);
				if (data && data.displayName) {
					req.userData.pseudonym = data.displayName;
				} else {
					req.userData.pseudonym = await temporaryDisplayNameApi.getByUserId(req.userData.user_id);
				}

				next();
			} catch (e) {
				console.error(e);
				next();
			}
		} else {
			next();
		}
	} else {
		next();
	}
};
