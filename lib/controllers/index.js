"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	db.any('SELECT * FROM discussions').then((discussions) => {
		res.render('index', {
			title: 'Long Room',
			subtitle: 'In depth comment and analysis',
			discussions: discussions || []
		});
	}).catch((err) => {
		next(err);
	});
};
