"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');
const commentsApi = require('../services/commentsApi');
const Promise = require('bluebird');

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
	const isAdmin = req.userData.is_editor;


	return Promise.join(db.user.find(userId), commentsApi.getUser(userId), (lrUser, commentsUser) => {
		if (!lrUser) {
			return next();
		}

		const pseudonym = commentsUser.displayName;

		const viewData = {
			title: `${pseudonym} | Long Room | FT Alphaville`,
			userPseudonym: pseudonym,
			userSummary: lrUser.userSummary
		};

		if (isAdmin) {
			viewData.displaySuspendButton = (lrUser.status === 'approved');
			viewData.displayReinstateButton = (lrUser.status === 'revoked');
			viewData.userId = userId;
		}

		return db.post.countByUserId(queryOptions).then(count => {
			const totalPages = Math.ceil(count / itemsPerPage);

			if (page > totalPages) {
				viewData.posts = [];
				return res.render('author', viewData);
			}

			queryOptions.limit = itemsPerPage;
			queryOptions.offset = (page - 1) * itemsPerPage;

			return db.post.selectByUserId(queryOptions)
				.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
				.then(postsDbTransformation.groupByTime)
				.then(postsDbTransformation.setAdMarkers)
				.then(posts => {
					viewData.posts = posts;
					viewData.pagination = pagination.getRenderConfig(page, totalPages, req);

					res.render('author', viewData);
				});
		});
	}).catch(err => {
		console.log('Error fetching the user or content for author page', err);
		next(err);
	});
};
