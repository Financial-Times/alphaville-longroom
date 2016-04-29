const express = require('express');
const router = new express.Router();
const fs = require('fs');
const path = require('path');

const externalPartials = {
	barrier: fs.readFileSync(path.join(__dirname, '../bower_components/alphaville-barrier/main.handlebars'), 'utf-8')
};

const authConfig = {
	checkHeader: process.env['AUTH_HEADER'],
	access: process.env['AUTH_HEADER_VALUE']
};

router.use('/', (req, res, next) => {
	res.set('Vary', authConfig.checkHeader);
	if(req.get(authConfig.checkHeader) === authConfig.access) {
		return next();
	}
	return res.render('barrier', {
		title: 'FT Alphaville',
		barrierModel: req.barrierModel,
		partials: {
			barrier: externalPartials.barrier
		}
	});
});

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom'
	});
});



module.exports = router;
