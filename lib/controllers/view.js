"use strict";

const db = require('../services/db').db;

module.exports = function (req, res, next) {
	if (req.params.id) {
		return db.post.selectById(req.params.id)
			.then(post => {
				if (post && post.length === 1) {
					post = post[0];
				}

				if (!post || !post.title) {
					return next();
				}

				res.render('content', {
					title: 'Long Room',
					article: post,
					editAndDelete: post.user_id === req.userUuid ? true : false
				});
			}).catch(err => {
				console.log('Error fetching the content', err);
				next(err);
			});
	} else {
		next();
	}
};
