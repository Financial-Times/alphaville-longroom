"use strict";

const db = require('../services/db').db;
const aws = require('../services/aws');

module.exports = function (req, res, next) {
	if (req.params.id) {
		return db.post.selectById(req.params.id)
			.then(post => {
				if (post && post.length === 1) {
					post = post[0];
				}

				// TODO: or admin
				if (req.userUuid !== post.user_id) {
					const err = new Error('Permission denied');
					err.status = 403;
					return next(err);
				}

				const s3 = new aws.S3();

				Promise.all(post.files.map(file => {
					return new Promise((resolve, reject) => {
						s3.deleteObject({
							Bucket: process.env.S3_AWS_BUCKET_NAME,
							Key: file.name
						}, (err) => {
							if (err) {
								console.log('error deleting file', file.name, err);

								reject(err);
								return;
							}

							resolve();
						});
					});
				}))
				.then(() => {
					return db.tx(transaction => {
						const queries = [
							transaction.tagToPost.deleteAllForPost(post.id),
							transaction.post.delete(post.id),
							...(post.files.map(file => transaction.file.delete(file.id)))
						];

						return transaction.batch(queries);
					}).catch(err => {
						err = err || new Error("Transaction failed");
						err.postId = post.id;

						throw err;
					});
				})
				.then(() => {
					res.setFlashMessage('success', 'Post successfully deleted.');
					res.redirect('/longroom/home');
				})
				.catch((err) => {
					console.log('Error while deleting post', post.id, err);
					res.setFlashMessage('error', 'Post partially deleted. Please try again later.');
					res.redirect('/longroom/content/' + post.id);
				});
			}).catch(err => {
				console.log('Error fetching the content', err);
				next(err);
			});
	} else {
		next();
	}
};
