const express = require('express');
const router = new express.Router();
const controllers = {
	create: require('../lib/controllers/create')
};
const auth = require('alphaville-auth-middleware');

router.use('/', auth());

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom'
	});
});

router.get('/create', controllers.create.get);
router.post('/create', controllers.create.post);

module.exports = router;
