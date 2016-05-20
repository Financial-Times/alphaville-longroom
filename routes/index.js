const express = require('express');
const router = new express.Router();
const controller = require('../lib/controllers/index');

router.route('/').get(controller);

module.exports = router;
