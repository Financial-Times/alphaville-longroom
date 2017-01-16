module.exports = function (req, res, next) {
	if (!req.userPseudonym) {
		res.redirect('/longroom/user/setpseudonym?redirect=' + encodeURIComponent(req.originalUrl));
	} else {
		next();
	}
};
