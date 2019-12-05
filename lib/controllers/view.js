"use strict";

const db = require('../services/db').db;
const path = require('path');

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
					const commentsUseCoralMilestoneDate = process.env.COMMENTS_USE_CORAL_MILESTONE_DATE;
					const commentsUseCoralTalk = process.env.COMMENTS_USE_CORAL_TALK === 'true';
					const publishedAt = post.published_at.toISOString();

					let useCoralTalk = false;
					if (commentsUseCoralMilestoneDate && commentsUseCoralTalk && publishedAt > commentsUseCoralMilestoneDate) {
						useCoralTalk = true;
					}

					// Temporary addition until comments migration is complete
					const now = new Date().getTime();
					const startOf2020 = 1577836800000; // 2020-01-01T00:00:00.000Z
					const commentsMigrationMessage = now >= startOf2020;

					const canonicalUrl = `${process.env.APP_URL}/content/${post.id}`;

					res.render('content', {
						title: post.title + ' | Long Room | FT Alphaville',
						article: post,
						editAndDelete: (req.userData && (req.userData.user_id === post.user_id || req.userData.is_editor)) ? true : false,
						canonicalUrl,
						useCoralTalk,
						commentsMaintenanceMode: process.env.COMMENTS_MAINTENANCE_MODE === 'true',
						commentsMigrationMessage,
						alphavilleUiShareData: {
							article: post.dataForShare,
							position: 'bottom',
							hideCommentCount: true
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
