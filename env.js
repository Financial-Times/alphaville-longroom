module.exports = {
	env: process.env.ENVIRONMENT || 'test',
	auth: {
		header: process.env['AUTH_HEADER']
	}
};
