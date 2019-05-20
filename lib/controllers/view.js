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

				// TODO: admin access
				if (post.published || (req.userData && (req.userData.user_id === post.user_id || req.userData.is_editor))) {
					// Temporary addition until the comments are replaced
					const flags = req.cookies['next-flags'];
					const commentsTalkReplacement = flags && flags.indexOf('commentsTalkReplacement:on') >= 0;

					res.render('content', {
						title: post.title + ' | Long Room | FT Alphaville',
						article: post,
						editAndDelete: (req.userData && (req.userData.user_id === post.user_id || req.userData.is_editor)) ? true : false,
						commentsTalkReplacement,
						alphavilleUiShareData: {
							article: post.dataForShare,
							position: 'bottom'
						}
					});
				} else {
					next();
				}
			}).catch(err => {
				console.log('Error fetching the content', err);
				next(err);
			});
	} else {
		next();
	}
};
