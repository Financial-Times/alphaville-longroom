const express = require('express');
const router = new express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('alphaville-auth-middleware');

router.use('/', auth());

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom'
	});
});



module.exports = router;
