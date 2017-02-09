"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');
const sudsService = require('../services/suds');

const itemsPerPage = 30;

module.exports = function (req, res, next) {

	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}

	if (!page || page < 1) {
		page = 1;
	}

	let userId = null;

	if (req.params.id) {
		userId = req.params.id;
	}

	const queryOptions = {
		user_id : userId
	};

	db.post.countByUserId(queryOptions).then(count => {

		const totalPages = Math.ceil(count / itemsPerPage);

		if (page > totalPages) {
			return next();
		}
		queryOptions.limit = itemsPerPage;
		queryOptions.offset = (page - 1) * itemsPerPage;

		return db.post.selectByUserId(queryOptions)
		.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
		.then(postsDbTransformation.groupByTime)
		.then(postsDbTransformation.setAdMarkers)
		.then(posts => {
			return sudsService.getPseudonym([userId])
			.then(pseudonyms => {
				return pseudonyms[userId];
			})
			.then(pseudonym => {
				res.render('author', {
					title: pseudonym + ' | Long Room | FT Alphaville',
					userPseudonym: pseudonym,
					userSummary : posts[0].items[0].user_summary,
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
