const alphavilleExpress = require('./lib/alphaville-express');
const canShowdecommNotficationBannerMiddleware = require('./lib/middlewares/decommNotficationBanner');
const flashMessageMiddleware = require('./lib/middlewares/flashMessage');
const userMiddleware = require('./lib/middlewares/user');
const overheardComponentMiddleware = require('./lib/middlewares/overheardComponentData');
const fingerprint = require('./build_config/js/fingerprint');
const expressWebService = require('@financial-times/express-web-service');
const path = require('path');
const bodyParser = require('body-parser');
const healthcheck = require('./lib/health/healthchecks');

const _ = require('lodash');

const env = process.env.ENVIRONMENT === 'prod' ? 'prod' : 'test';

const app = alphavilleExpress({
	directory: __dirname,
	appBasePath: 'longroom',
	navSelected: 'Long Room',
	fingerprint: fingerprint,
	env: env
});

app.use('/longroom', expressWebService({
	manifestPath: path.join(__dirname, 'package.json'),
	about: {
		"schemaVersion": 1,
		"name": "longroom",
		"purpose": "FT Alphaville's exclusive comment and analysis arena, where finance professionals are invited to share their research and thoughts on financial markets",
		"audience": "public",
		"primaryUrl": "https://ftalphaville.ft.com/longroom",
		"serviceTier": "silver"
	},
	goodToGoTest: function() {
		return true;
	},
	healthCheck: function() {
		return healthcheck.getChecks().then(checks => {
			return checks;
		}).catch((err) => {
			console.log(err);
			return [
				{
					name: "Healthcheck",
					ok: false,
					severity: 2,
					businessImpact: "Some areas of the application might be unavailable due to this issue.",
					technicalSummary: "Healthcheck is not available.",
					panicGuide: "Check the logs of the application, try to restart it from heroku.",
					checkOutput: "Healthcheck generation failed.",
					lastUpdated: new Date().toISOString()
				}
			];
		});
	}
}));

if (process.env.APP_URL && process.env.APP_URL[process.env.APP_URL.length - 1] === '/') {
	process.env.APP_URL = process.env.APP_URL.substr(0, process.env.APP_URL.length - 1);
}

app.use(function (req, res, next ) {
	const _render = res.render;
	res.render = function( view, options, fn ) {
		options = options || {};

		options.headerConfig = options.headerConfig || {};

		if (!options.title) {
			options.title = 'Long Room | FT Alphaville';
		}

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

app.use(bodyParser.urlencoded({extended: true}));

app.use(flashMessageMiddleware);
app.use(canShowdecommNotficationBannerMiddleware);

app.use(userMiddleware);
app.use(overheardComponentMiddleware);

app.use('/', require('./routes/__access_metadata'));
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
