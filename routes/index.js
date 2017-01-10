const express = require('express');
const router = new express.Router();
const controller = require('../lib/controllers/index');

router.route('/').get(controller);

router.get('/echo*', (req, res) => {
	res.send(req.originalUrl);
});

module.exports = router;
