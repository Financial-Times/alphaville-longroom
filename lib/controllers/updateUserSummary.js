const db = require('../services/db').db;

module.exports = function (req, res, next) {

	let userId = req.userUuid;

	if (userId) {

		const queryParam = {user_id: userId, summary:req.body.summary}

		return db.user.updateSummary(queryParam)
			.then(post => {
				res.redirect('/longroom/dashboard');
			}).
			catch(err => {
				console.log('Error updating user summary', err);
				next(err);
			});
	} else {
		next();
	}
};
