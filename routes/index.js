const express = require('express');
const router = express.Router();

const renderPage = require('alphaville-page-render');
const headerConfig = require('alphaville-header-config');

router.get('/', (req, res) => {
	renderPage(res, 'index', 'longroom', {
		title: 'Alphaville Longroom',
		headerConfig: headerConfig.setSelected('Longroom')
	});
});



module.exports = router;
