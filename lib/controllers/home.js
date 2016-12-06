"use strict";

const db = require('../services/db').db;
const _ = require('lodash');
const fileTypes = require('../utils/fileTypes');

module.exports = function (req, res, next) {
	const isObjectInArray = function (arr, toMatch) {
		if (!toMatch.length) {
			toMatch = [toMatch];
		}

		for (let i = 0; i < arr.length; i++) {
			let match = true;

			toMatch.forEach(matchItem => {
				if (arr[i][matchItem.key] !== matchItem.value) {
					match = false;
				}
			});

			if (match) {
				return true;
			}
		}

		return false;
	};

	db.post.selectAll().then(posts => {
		const normalizedPosts = {};
		const postsArr = [];

		posts.forEach(post => {
			let currentPost;

			if (!normalizedPosts[post.id]) {
				normalizedPosts[post.id] = _.pick(post, ['id', 'title', 'summary', 'post_type', 'user_id', 'published', 'created_at', 'published_at']);
				normalizedPosts[post.id].tags = [];
				normalizedPosts[post.id].files = [];
			}

			currentPost = normalizedPosts[post.id];

			if (post.tag_name) {
				if (!isObjectInArray(currentPost.tags, {
						value: post.tag_id,
						key: 'id'
					})) {
					currentPost.tags.push({
						id: post.tag_id,
						name: post.tag_name,
						index: post.tag_index
					});
				}
			}

			if (post.tag_name) {
				if (!isObjectInArray(currentPost.files, [
						{
							value: post.file_name,
							key: 'name'
						},
						{
							value: post.file_size,
							key: 'size'
						},
						{
							value: post.file_type,
							key: 'type'
						},
						{
							value: post.file_source,
							key: 'source'
						}
					])) {
					currentPost.files.push({
						name: post.file_name,
						size: post.file_size,
						type: post.file_type,
						source: post.file_source,
						iconName: fileTypes.icons[post.file_type]
					});
				}
			}
		});

		Object.keys(normalizedPosts).forEach(key => {
			const post = normalizedPosts[key];
			post.tags.sort((a, b) => {
				if (a.index > b.index) {
					return 1;
				}

				if (a.index < b.index) {
					return -1;
				}

				return 0;
			});

			if (post.tags.length) {
				post.primaryTag = _.omit(post.tags[0], ['index']);
			}

			postsArr.push(post);
		});

		res.render('home', {
			title: 'Long Room',
			posts: postsArr
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
