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

	let tagId = null;

	if (req.params.id) {
		tagId = req.params.id;
	}

	db.tag.selectById(tagId).then(tag => {

		return db.post.countByTagId(tag.id).then(count => { 
			const totalPages = Math.ceil(count / itemsPerPage);
			if (page > totalPages) {
				return next();
			}
			return db.post.selectByTagId({
				tag_id: tag.id,
				limit: itemsPerPage,
				offset: (page - 1) * itemsPerPage
			})
			.then(postsDbTransformation.groupByTime)
			.then(posts => {
				res.render('tags', {
					title: tag.name + ' | Long Room | FT Alphaville',
					tagName: tag.name,
					posts: posts,
					pagination: pagination.getRenderConfig(page, totalPages, req)
			});
		});
	})

	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
