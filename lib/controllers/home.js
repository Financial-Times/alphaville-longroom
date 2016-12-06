"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	res.render('home', {
		title: 'Long Room'
	});
};
