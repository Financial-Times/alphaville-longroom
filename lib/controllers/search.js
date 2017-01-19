"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');

const itemsPerPage = 30;

module.exports = function (req, res, next) {
	if (!req.query.q || req.query.q.length < 2) {
		return res.render('search', {
			title: 'Search | Long Room | FT Alphaville',
			message: 'Search term should be at least 2 characters long.'
		});
	}

	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}

	if (!page || page < 1) {
		page = 1;
	}

	db.post.countSearch({
		query: req.query.q
	}).then(count => {
		if (!count) {
			return res.render('search', {
				title: 'Search | Long Room | FT Alphaville',
				message: `No results found for ${req.query.q}`
			});
		}

		const totalPages = Math.ceil(count / itemsPerPage);

		if (page > totalPages) {
			return next();
		}

		return db.post.selectSearch({
			query: req.query.q,
			limit: itemsPerPage,
			offset: (page - 1) * itemsPerPage
		})
		.then(posts => {
			posts.forEach(post => {
				// TODO: admin
				if (req.userUuid === post.user_id) {
					post.editAndDelete = true;
				}
			});

			return posts;
		})
		.then(postsDbTransformation.groupByTime)
		.then(postsDbTransformation.setAdMarkers)
		.then(posts => {
			res.render('search', {
				title: 'Search | Long Room | FT Alphaville',
				query: req.query.q,
				posts: posts,
				pagination: pagination.getRenderConfig(page, totalPages, req)
			});
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
