const express = require('express');
const router = express.Router();
const auth = require('alphaville-auth-middleware');


const renderPage = require('alphaville-page-render');
const headerConfig = require('alphaville-header-config');

const authConfig = {
	checkHeader: process.env['AUTH_HEADER']
};

router.use('/', auth(authConfig), (req, res, next) => {
	if (req.hasOwnProperty('isAuthenticated') && req.isAuthenticated === false ) {
		return renderPage(res, 'barrier', 'index', {
			title: 'FT Alphaville',
			barrierModel: req.barrierModel,
			headerConfig: headerConfig.setSelected('Longroom'),
			partials: {
				barrier: '../bower_components/alphaville-barrier/main.hjs'
			}
		});
	}
	return next();
});

router.get('/', (req, res) => {
	renderPage(res, 'index', 'longroom', {
		title: 'Alphaville Longroom',
		headerConfig: headerConfig.setSelected('Longroom')
	});
});



module.exports = router;
