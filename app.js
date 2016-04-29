const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = {
	index: require('./routes/index'),
	__gtg: require('./routes/__gtg')
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/assets/longroom/bower/*.(woff|svg|ttf|eot|gif|png|jpg)', (req, res) => {
	const newPath = req.originalUrl.split('/').slice(4).join('/');
	res.sendFile(path.join(__dirname, '/bower_components', newPath));
});
app.use('/assets/longroom', express.static(path.join(__dirname, 'public')));

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
