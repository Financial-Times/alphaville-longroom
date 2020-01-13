const db = require('../services/db').db;
const commentsApi = require('../services/commentsApi');
const temporaryDisplayNameApi = require('../services/temporaryDisplayNameApi');

module.exports = async function (req, res, next) {
	if (req.userData) {
		if (!req.userData.has_pseudonym) {
			try {
				const data = await commentsApi.getUser(req.userData.user_id);
				if (data && data.displayName) {
					req.userData.pseudonym = data.displayName;

					db.user.updatePseudonymFlag({
						id: req.userData.user_id,
						hasPseudonym: true
					});

					db.displayNames.deleteByUserId(req.userData.user_id);

					next();
				} else {
					req.userData.pseudonym = await temporaryDisplayNameApi.getByUserId(req.userData.user_id);
					req.userData.hasTemporaryPseudonym = !!req.userData.pseudonym;
					next();
				}
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
