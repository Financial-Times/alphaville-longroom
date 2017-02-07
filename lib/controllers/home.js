"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');

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
		const totalPages = Math.ceil(count / itemsPerPage);

		if (page > totalPages) {
			return next();
		}

		return db.post.selectAll({
			limit: itemsPerPage,
			offset: (page - 1) * itemsPerPage
		})
		.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
		.then(postsDbTransformation.groupByTime)
		.then(postsDbTransformation.setAdMarkers)
		.then(posts => {
			res.render('home', {
				isAdmin: req.userData.is_editor,
				title: 'Long Room | FT Alphaville',
				posts: posts,
				pagination: pagination.getRenderConfig(page, totalPages, req)
			});
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
