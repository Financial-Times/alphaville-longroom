"use strict";

const db = require('../services/db').db;

const MAX_TAGS = 3;
const MAX_TAG_LENGTH = 30;


exports.getUploadDocumentForm = (req, res) => {
	res.render('create_form', {
		title: 'Upload document | Alphaville Longroom',
		postType: 'document',
		isDocumentForm: true
	});
};

exports.getWriteAPostForm = (req, res) => {
	res.render('create_form', {
		title: 'Write a post | Alphaville Longroom',
		postType: 'post',
		isPostForm: true
	});
};

exports.post = (req, res) => {
	const validation = {};

	if (!req.userData) {
		res.status(401);
		return res.json({
			success: false,
			genericMessage: "You do not have permission to create a post/upload a document."
		});
	} else {
		const postType = req.body.postType;
		let tags = [];

		if (postType !== 'post' && postType !== 'document') {
			res.json({
				success: false,
				genericMessage: "An error occured. Please try again later."
			});
			return;
		}

		if (!req.body.title || !req.body.title.trim()) {
			validation.title = 'Title is required.';
		}

		if (!req.body.tags || !req.body.tags.trim()) {
			validation.tags = 'Topic tags are required.';
		}

		if (!validation.tags) {
			tags = req.body.tags.trim().split(",");

			if (tags.length > MAX_TAGS) {
				validation.tags = `Maximum ${MAX_TAGS} number of tags can be selected.`;
			} else {
				tags.forEach(tag => {
					if (tag.length > MAX_TAG_LENGTH) {
						validation.tags = `Tags cannot exceed ${MAX_TAG_LENGTH} characters.`;
					}
				})
			}
		}

		if (postType === 'post' && (!req.body.summary || !req.body.summary.trim())) {
			validation.summary = 'Summary is required.';
		}

		if (postType === 'document' && (!req.body.files || !req.body.files.length)) {
			validation.files = 'It is mandatory to upload at least one document.';
		}

		if (req.body.files && req.body.files.length) {
			req.body.files.forEach(fileInfo => {
				if (!fileInfo.fileId) {
					validation.files = validation.files || {};
					validation.files[fileInfo.fileUploadFormElId] = "Please upload a file.";
				}

				if (!fileInfo.source) {
					validation.files[fileInfo.fileUploadFormElId] = "Document source is required.";
				}
			});
		}

		if (Object.keys(validation).length) {
			res.json({
				success: false,
				validation
			});
		} else {
			db.post.insert({
				title: req.body.title.trim(),
				summary: req.body.summary.trim() ? req.body.summary.trim() : null,
				post_type: postType,
				user_id: req.userData.user_id,
				published: req.body.publish ? true : false,
				published_at: req.body.publish ? new Date() : null
			}).catch(err => {
				// post save failed
				err = err || new Error("Post save failed");
				err.postSaveFailed = true;

				throw err;
			}).then(postId => {
				const getTagQueries = function (transaction) {
					return Promise.all(tags.map((tag, index) => {
						tag = tag.trim();

						if (tag) {
							return db.tag.selectByName(tag).then(tagEntry => {
								if (!tagEntry) {
									return db.tag.insert({
										name: tag.trim()
									});
								} else {
									return tagEntry.id;
								}
							}).then(tagId => {
								return Promise.resolve(transaction.tagToPost.insert({
									tag_id: tagId,
									post_id: postId,
									index: index
								}));
							});
						} else {
							return Promise.resolve();
						}
					}));
				};

				const getFileQueries = function (transaction) {
					return Promise.all(req.body.files.map(file => {
						if (file && file.fileId) {
							return db.file.selectById(file.fileId).then(fileEntry => {
								if (fileEntry) {
									return Promise.resolve([
										transaction.file.addSource({
											source: file.source.trim(),
											id: fileEntry.id
										}),
										transaction.file.attachToPost({
											post_id: postId,
											id: fileEntry.id
										})
									]);
								} else {
									throw new Error("File does not exist");
								}
							});
						} else {
							return Promise.resolve();
						}
					})).then(results => {
						// flatten the array
						return [].concat.apply([], results);
					});
				};

				return db.tx(transaction => {
					return Promise.all([
						getTagQueries(transaction),
						getFileQueries(transaction)
					]).then(queries => {
						return transaction.batch(queries[0].concat(queries[1]));
					}).then(() => {
						return postId;
					});
				}).catch(err => {
					err = err || new Error("Transaction failed");
					err.postId = postId;

					throw err;
				});
			}).then((postId) => {
				res.json({
					success: true,
					postId: postId,
					url: '/longroom/content/' + postId
				});
			}).catch(err => {
				if (err && !err.postSaveFailed && err.postId) {
					db.post.delete(err.postId);
				}

				console.log('ERROR while saving post', err);
				res.json({
					success: false,
					genericMessage: "An error occured. Please try again later."
				});
				return;
			});
		}
	}
};
