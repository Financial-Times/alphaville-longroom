"use strict";

const _ = require('lodash');
const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');
const sudsService = require('../services/suds');

const itemsPerPage = 30;

module.exports = function (req, res, next) {

	let userId = req.userUuid;

	const queryOptions = {
		user_id : userId,
		limit: 9999
	}

	const viewData = {
		title: 'Edit My Posts | Long Room | FT Alphaville',
		userDetails : {},
		drafts: [],
		posts: []
	};

	const transformPromises = [
		db.post.selectByUserId(_.defaults({published:true}, queryOptions)).then(posts => {
			viewData.posts = posts;
		}),
		db.post.selectByUserId(_.defaults({published:false}, queryOptions)).then(posts => {
			viewData.drafts = posts;
		})

	];

	transformPromises.push();
	
	Promise.all(transformPromises).then(() => {
		// console.log('viewData: ', viewData);
		res.render('myposts', viewData);
	});

};
