module.exports = (req, res, next) => {
	if (req.userData) {
		if (req.userData.status === 'approved') {
			return res.redirect('/longroom/home');
		}
	}

	next();
};
