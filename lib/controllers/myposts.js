"use strict";

const _ = require('lodash');
const db = require('../services/db').db;
const postsDbTransformation = require('../dbNormalizers/posts');

module.exports = function (req, res, next) {
	if (!req.userData || !req.userData.user_id) {
		const err = new Error('Permission denied');
		err.status = 401;
		return next(err);
	}

	const userId = req.userData.user_id;

	const queryOptions = {
		user_id : userId,
		limit: 9999
	};

	const viewData = {
		title: 'Dashboard | Long Room | FT Alphaville',
		userDetails: {
			summary : req.userData.summary,
			pseudonym: req.userData.pseudonym
		},
		drafts: [],
		posts: []
	};

	const transformPromises = [
		db.post.selectByUserId(_.defaults({published:true}, queryOptions))
			.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
			.then(posts => {
				viewData.posts = posts;
			}),
		db.post.selectByUserId(_.defaults({published:false}, queryOptions))
			.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
			.then(posts => {
				viewData.drafts = posts;
			})
	];

	Promise.all(transformPromises).then(() => {
		// console.log('viewData: ', viewData);
		res.render('myposts', viewData);
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});


};
