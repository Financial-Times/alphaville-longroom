'use strict';

const router = require('express').Router();
const auth = require('alphaville-auth-middleware');

router.use('/', auth());

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Long Room',
		subtitle: 'In depth comment and analysis'
	});
});

router.use('/create', require('./routes/discussionsRouter'));
router.use('/join', require('./routes/membershipRouter'));

module.exports = router;
