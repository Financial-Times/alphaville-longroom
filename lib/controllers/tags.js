"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');

const itemsPerPage = 30;

module.exports = function (req, res, next) {
	console.log('tags.js');
	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}

	if (!page || page < 1) {
		page = 1;
	}

	let tagId = null;

	if (req.params.id) {
		tagId = parseInt(req.params.id);
	}

	console.log('tagId: ', tagId);

	db.post.countAll().then(count => { 
		console.log('countAll: ', count);
		const totalPages = Math.ceil(count / itemsPerPage);

		console.log('totalPages: ', totalPages, page);

		if (page > totalPages) {
			return next();
		}

		return db.post.selectByTagId({
			tag_id: tagId,
			limit: itemsPerPage,
			offset: (page - 1) * itemsPerPage
		})
		.then(postsDbTransformation.groupByTime)
		.then(posts => {
			res.render('tags', {
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
