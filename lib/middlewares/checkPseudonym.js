module.exports = function (req, res, next) {
	if (req.userUuid && !req.userPseudonym) {
		res.redirect('/longroom/user/setpseudonym?redirect=' + encodeURIComponent(req.originalUrl));
	} else {
		next();
	}
};
