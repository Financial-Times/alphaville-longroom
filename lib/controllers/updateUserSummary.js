const db = require('../services/db').db;

module.exports = function (req, res, next) {

	let userId = req.userUuid;

	console.log('userId: ', userId);
	
	if (userId) {

		console.log('summary: ', req.body.summary);

		const queryParam = {user_id: userId, summary:''}

		return db.user.updateSummary(queryParam)
			.then(post => {

				res.redirect('/longroom/myposts');
			}).
			catch(err => {
				console.log('Error fetching the content', err);
				next(err);
			});
	} else {
		next();
	}
};
