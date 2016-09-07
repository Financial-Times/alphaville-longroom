const alphavilleExpress = require('alphaville-express');
const fingerprint = require('./build_config/js/fingerprint');

const env = process.env.ENVIRONMENT === 'prod' ? 'prod' : 'test';

const app = alphavilleExpress({
	directory: __dirname,
	appBasePath: 'longroom',
	navSelected: 'The Long Room',
	fingerprint: fingerprint,
	env: env
});

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
		res.sendStatus(404);
	} else {
		res.render('error', {
			message: err.errMsg || err.message,
			error: isNotProdEnv ? err : {}
		})
	}
};

app.use(errorHandler);

module.exports = app;
