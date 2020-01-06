const db = require('../services/db').db;
const commentsApi = require('../services/commentsApi');

module.exports = function (req, res, next) {
	if (req.userData) {
		if (!req.userData.has_pseudonym) {
			return commentsApi.getUser(req.userData.user_id).then(data => {
				if (data && data.displayName) {
					req.userData.pseudonym = data.displayName;

					db.user.updatePseudonymFlag({
						id: req.userData.user_id,
						hasPseudonym: true
					});

					next();
				} else {
					next();
				}
			}).catch(next);
		} else {
			next();
		}
	} else {
		next();
	}
};
