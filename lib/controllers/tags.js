"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');
const sanitizeHtml = require('sanitize-html');
const entities = require('entities');

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
		if (!tag) {
			return next();
		}

		let tagName = tag.name;
		sanitizeHtml(tagName, {
			allowedTags: [],
			allowedAttributes: [],
			parser: {
				decodeEntities: true
			}
		});
		tagName = entities.decodeHTML(tagName);

		return db.post.countByTagId(tag.id).then(count => {
			const totalPages = Math.ceil(count / itemsPerPage);
			if (count === 0) {
				return res.render('tags', {
					title: tagName + ' | Long Room | FT Alphaville',
					tagName: tagName,
					message: 'No posts found.'
				});
			}

			if (page > totalPages) {
				return next();
			}
			return db.post.selectByTagId({
				tag_id: tag.id,
				limit: itemsPerPage,
				offset: (page - 1) * itemsPerPage
			})
			.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
			.then(postsDbTransformation.groupByTime)
			.then(postsDbTransformation.setAdMarkers)
			.then(posts => {
				res.render('tags', {
					title: tagName + ' | Long Room | FT Alphaville',
					tagName: tagName,
					posts: posts,
					pagination: pagination.getRenderConfig(page, totalPages, req)
				});
			});
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
