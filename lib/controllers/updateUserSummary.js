const db = require('../services/db').db;

module.exports = function (req, res, next) {
	if (!req.userData || !req.userData.user_id) {
		const err = new Error('Permission denied');
		err.status = 401;
		return next(err);
	}

	const userId = req.userData.user_id;
	const queryParam = {
		user_id: userId,
		summary: req.body.summary
	};

	return db.user.updateSummary(queryParam)
		.then(() => {
			res.setFlashMessage('success', 'Summary saved successfully.');

			res.redirect('/longroom/dashboard');
		}).
		catch(err => {
			console.log('Error updating user summary', err);
			next(err);
		});
};
