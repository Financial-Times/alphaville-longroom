const express = require('express');
const router = express.Router();

const renderPage = require('alphaville-page-render');
const headerConfig = require('alphaville-header-config');

/*router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom',

		assetsBasePath: '/assets/longroom',
		basePath: '/longroom',

		isTest: process.env.ENVIRONMENT === 'test' ? true : false,
		isProd: process.env.ENVIRONMENT === 'prod' ? true : false,

		headerConfig: headerConfig,
		partials: {
			header: '../bower_components/alphaville-header/main.hjs'
		}
	});
});
*/

router.get('/', (req, res) => {
	renderPage(res, 'index', 'longroom', {
		title: 'Alphaville Longroom',
		headerConfig: headerConfig.setSelected('Longroom')
	});
});



module.exports = router;
