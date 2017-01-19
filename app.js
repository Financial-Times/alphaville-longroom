const alphavilleExpress = require('alphaville-express');
const flashMessageMiddleware = require('./lib/middlewares/flashMessage');
const userMiddleware = require('./lib/middlewares/user');
const overheardComponentMiddleware = require('./lib/middlewares/overheardComponentData');
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

if (process.env.APP_URL && process.env.APP_URL[process.env.APP_URL.length - 1] === '/') {
	process.env.APP_URL = process.env.APP_URL.substr(0, process.env.APP_URL.length - 1);
}

app.use(function (req, res, next ) {
	const _render = res.render;
	res.render = function( view, options, fn ) {
		options = options || {};

		options.headerConfig = options.headerConfig || {};

		_.merge(options, {
			appUrl: process.env.APP_URL,
			adZone: 'alphaville.long.room',
			headerConfig: Object.assign(options.headerConfig, {
				searchUrl: '/longroom/search',
				searchTitle: 'Long Room'
			})
		});

		_render.call(this, view, options, fn);
	};
	next();
});

app.use(flashMessageMiddleware);

app.use(userMiddleware);
app.use(overheardComponentMiddleware);

app.use('/', require('./routes/__gtg'));
app.use('/longroom', require('./router'));

app.all('/', (req, res) => {
	res.redirect('/longroom/home');
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
