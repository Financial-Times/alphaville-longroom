const alphavilleExpress = require('alphaville-express');
const fingerprint = require('./build_config/js/fingerprint');

const env = process.env.ENVIRONMENT === 'prod' ? 'prod' : 'test';

const app = alphavilleExpress({
	directory: __dirname,
	appBasePath: 'longroom',
	headerConfig: require('alphaville-header-config'),
	navSelected: 'The Long Room',
	fingerprint: fingerprint,
	env: env
});

app.use('/', require('./routes/__gtg'));
app.use('/longroom', require('./router'));

app.get('/', function (req, res) {
	res.redirect('/longroom');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
const errorHandler = (err, req, res, next) => {
	const isNotProdEnv = app.get('env') === 'development' ||
		process.env.ENVIRONMENT !== 'prod';

	if (err.status === 404) {
		res.sendStatus(404);
	} else {
		res.status(err.status || 503);
		res.render('error', {
			message: err.errMsg || err.message,
			error: isNotProdEnv ? err : {}
		})
	}
};

app.use(errorHandler);

module.exports = app;
