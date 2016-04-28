const express = require('express');
const router = express.Router();
const auth = require('alphaville-auth-middleware');


const renderPage = require('alphaville-page-render');
const headerConfig = require('alphaville-header-config');

const authConfig = {
	checkHeader: process.env['AUTH_HEADER'],
    access: process.env['AUTH_HEADER_VALUE']
};

router.use('/', (req, res, next) => {
    res.set('Vary', authConfig.checkHeader);
    if(req.get(authConfig.checkHeader) === authConfig.access) {
        return next();
	}
    return renderPage(res, 'barrier', 'index', {
        title: 'FT Alphaville',
        barrierModel: req.barrierModel,
        headerConfig: headerConfig.setSelected('Longroom'),
        partials: {
            barrier: '../bower_components/alphaville-barrier/main.hjs'
        }
    });
});

router.get('/', (req, res) => {
	renderPage(res, 'index', 'longroom', {
		title: 'Alphaville Longroom',
		headerConfig: headerConfig.setSelected('Longroom')
	});
});



module.exports = router;
