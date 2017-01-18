const recentCommentsApi = require('../services/recentComments');
const _ = require('lodash');
const striptags = require('striptags');
const cache = require('memory-cache');

module.exports = function (req, res, next) {
	let promise;

	if (cache.get('overheardData')) {
		console.log('loaded from cache');
		promise = Promise.resolve(cache.get('overheardData'));
	} else {
		console.log('load from api');
		promise = recentCommentsApi.get('longroom', process.env.OVERHEARD_NUMBER_OF_COMMENTS ? parseInt(process.env.OVERHEARD_NUMBER_OF_COMMENTS, 10) || 7 : 7)
			.then(recentComments => recentComments.map(comment => {
				comment.bodyHtml = _.truncate(striptags(comment.bodyHtml), {length: 100});
				comment.commentsArticleId = comment.articleId;
				comment.articleId = comment.articleId.replace('longroom', '');

				return comment;
			}))
			.then(recentComments => {
				cache.put('overheardData', recentComments, 1 * 60 * 1000); // 10 minutes
				console.log('put in cache');

				return recentComments;
			})
			.catch(err => {
				console.log('Failed to fetch recent comments', err);

				return [];
			});
	}



	promise.then(overheardData => {
		const _render = res.render;
		res.render = function( view, options, fn ) {
			options = options || {};

			_.merge(options, {
				overheardData: overheardData
			});

			_render.call(this, view, options, fn);
		};
		next();
	});
};
