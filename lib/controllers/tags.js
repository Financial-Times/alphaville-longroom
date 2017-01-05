"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');

const itemsPerPage = 30;

module.exports = function (req, res, next) {
	// console.log('tags.js');
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

	db.post.countAll().then(count => { 
		const totalPages = Math.ceil(count / itemsPerPage);

		if (page > totalPages) {
			return next();
		}


		const streamData = {
			tagName:null,
			posts: null
		};

		return db.tag.selectById(tagId)
		.then(tag => {
			streamData.tagName = tag.name;
			return streamData;
		})
		.then(streamData => {

			return db.post.selectByTagId({
				tag_id: tagId,
				limit: itemsPerPage,
				offset: (page - 1) * itemsPerPage
			})
			.then(posts => {
				streamData.posts = postsDbTransformation.groupByTime(posts);			
				return streamData;
			})
			.then(streamData => {
				res.render('tags', {
					title: 'Long Room',
					tagName: streamData.tagName,
					posts: streamData.posts,
					pagination: pagination.getRenderConfig(page, totalPages, req),
				});
			});

		});

	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
