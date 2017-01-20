const db = require('../services/db').db;
const sudsService = require('../services/suds');

module.exports = function (req, res, next) {
	if (req.userData) {
		if (!req.userData.pseudonym) {
			return sudsService.getPseudonym([req.userData.user_id]).then(data => {
				if (data && data[req.userData.user_id]) {
					req.userData.pseudonym = data[req.userData.user_id];
				}

				next();
			}).catch(next);
		} else {
			next();
		}
	} else {
		next();
	}
};
