var express = require('express');
var router = express.Router();

const envVars = require('../env');

const headerConfig = require('../bower_components/alphaville-header/template_config.json');

headerConfig.navItems.map(function (obj) {
	if (obj.name.indexOf('Longroom')>-1) {
		obj.selected = true;
	}
	return obj
});

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom',

		assetsBasePath: '/assets/longroom',
		basePath: '/longroom',

		isTest: envVars.env === 'test' ? true : false,
		isProd: envVars.env === 'prod' ? true : false,

		headerConfig: headerConfig,
		partials: {
			header: '../bower_components/alphaville-header/main.hjs'
		}
	});
});


module.exports = router;
