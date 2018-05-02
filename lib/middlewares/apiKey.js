module.exports = (req, res, next) => {
	if (req.headers['X-Api-Key'] === process.env.OWN_API_KEY ||
		req.query.apiKey === process.env.OWN_API_KEY) {
		return next();
	}

	res.status(403).json({
		success: false,
		reason: 'API key invalid'
	});
};
