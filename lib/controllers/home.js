"use strict";

const db = require('../services/db').db;
const pagination = require('../utils/pagination');
const postsDbTransformation = require('../dbNormalizers/posts');

const itemsPerPage = 30;

module.exports = function (req, res, next) {
	let page = 1;
	if (req.query.page) {
		page = parseInt(req.query.page);
	}

	if (!page || page < 1) {
		page = 1;
	}

	db.post.countAll().then(count => {
		const totalPages = Math.ceil(count / itemsPerPage);

		if (page > totalPages) {
			return next();
		}

		return db.post.selectAll({
			limit: itemsPerPage,
			offset: (page - 1) * itemsPerPage
		})
		.then(posts => postsDbTransformation.editAndDeleteFlag(posts, req.userData))
		.then(postsDbTransformation.groupByTime)
		.then(postsDbTransformation.setAdMarkers)
		.then(posts => {
			// Temporary addition until the comments are replaced
			posts.forEach((category) => {
				if (category && category.items) {
					category.items.forEach((article) => {
						const commentsUseCoralMilestoneDate = process.env.COMMENTS_USE_CORAL_MILESTONE_DATE;
						const commentsUseCoralTalk = process.env.COMMENTS_USE_CORAL_TALK === 'true';
						const publishedAt = article.published_at.toISOString();
						const commentsUseCoralTalkQuerystring = req.query.useCoralTalk;

						if ((commentsUseCoralMilestoneDate && commentsUseCoralTalk && publishedAt > commentsUseCoralMilestoneDate) || commentsUseCoralTalkQuerystring) {
							article.useCoralTalk = true;
						}
					});
				}
			});

			res.render('home', {
				title: 'Long Room | FT Alphaville',
				posts: posts,
				pagination: pagination.getRenderConfig(page, totalPages, req)
			});
		});
	}).catch(err => {
		console.log('Error fetching the content', err);
		next(err);
	});
};
