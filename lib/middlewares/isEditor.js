module.exports = (req, res, next) => {
	let { is_editor } = req.userData;
	if (!is_editor) {
		return res.redirect('/longroom/home');
	}
	return next();
};
