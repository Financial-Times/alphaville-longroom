"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	db.post.selectAll({
		limit: 30,
		offset: 0
	}).then(posts => {
		res.render('home', {
			title: 'Long Room',
			posts: posts
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
