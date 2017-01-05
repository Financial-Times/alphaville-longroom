"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	res.render('index', {
		title: 'Long Room | FT Alphaville',
		subtitle: 'In depth comment and analysis'
	});
};
