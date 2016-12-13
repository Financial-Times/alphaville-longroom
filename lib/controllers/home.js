"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');

const itemsPerPage = 30;

module.exports = function (req, res, next) {
	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}

	if (!page || page < 1) {
		page = 1;
	}

	db.post.countAll().then(count => {
		console.log(count);
		const totalPages = Math.ceil(count / itemsPerPage);

		return db.post.selectAll({
			limit: itemsPerPage,
			offset: (page - 1) * itemsPerPage
		}).then(posts => {
			res.render('home', {
				title: 'Long Room',
				posts: posts,
				pagination: pagination.getRenderConfig(page, totalPages, req),
			});
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
