const alphavilleExpress = require('alphaville-express');
const fingerprint = require('./build_config/js/fingerprint');

const env = process.env.ENVIRONMENT === 'prod' ? 'prod' : 'test';

const app = alphavilleExpress({
	directory: __dirname,
	appBasePath: 'longroom',
	navSelected: 'Longroom',
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

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
