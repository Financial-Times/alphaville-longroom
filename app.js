const alphavilleExpress = require('alphaville-express');
const flashMessageMiddleware = require('./lib/middlewares/flashMessage');
const fingerprint = require('./build_config/js/fingerprint');
const _ = require('lodash');

const env = process.env.ENVIRONMENT === 'prod' ? 'prod' : 'test';

console.log(env);

const app = alphavilleExpress({
	directory: __dirname,
	appBasePath: 'longroom',
	navSelected: 'Long Room',
	fingerprint: fingerprint,
	env: env
});

app.use(function (req, res, next ) {
	const _render = res.render;
	res.render = function( view, options, fn ) {
		options = options || {};

		_.merge(options, {
			appUrl: process.env.APP_URL,
			adZone: 'alphaville.long.room'
		});

		_render.call(this, view, options, fn);
	};
	next();
});

app.use(flashMessageMiddleware);

app.use('/', require('./routes/__gtg'));
app.use('/longroom', require('./router'));

app.all('/', (req, res) => {
	res.redirect('/longroom');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
const errorHandler = (err, req, res, next) => {
	const isNotProdEnv = app.get('env') === 'development' ||
		process.env.ENVIRONMENT !== 'prod';

	if (err.status === 404) {
		res.status(404);
		res.render('error_404');
	} else {
		res.status(err.status || 503);
		console.log('ERROR =>', err);
		res.render('error', {
			message: err.errMsg || err.message,
			error: isNotProdEnv ? err : {}
		});
	}
};

app.use(errorHandler);

module.exports = app;
