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

const routes = {
	index: require('./routes/index'),
	__gtg: require('./routes/__gtg')
};


app.get('/', function (req, res) {
	res.redirect('/longroom');
});

app.use('/longroom', routes.index);
app.use('/', routes.__gtg);

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
