"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	if (!process.env['SKIP_AUTH']) {
		return res.redirect('/longroom/home');
	}
	res.render('index', {
		title: 'Long Room | FT Alphaville',
		subtitle: 'In depth comment and analysis'
	});
};
