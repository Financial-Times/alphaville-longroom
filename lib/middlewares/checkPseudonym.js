module.exports = function (req, res, next) {
	console.log('checkPseudonym called');
	if (!req.userPseudonym) {
		console.log('redirect');
		next();
		//res.redirect('/longroom/user/setpseudonym?redirect=' + encodeURIComponent(req.originalUrl));
	} else {
		console.log('no redirect');
		next();
	}
};
