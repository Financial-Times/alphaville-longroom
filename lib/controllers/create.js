"use strict";

const db = require('../services/db').db;
const userMiddleware = require('../middlewares/user');


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


function postResponse (req, res, data) {
	if (req.xhr) {
		res.json(data);
	} else {
		if (req.body.upload === 'iframe') {
			res.setHeader('Content-type', 'text/html');
			res.send(data);
		} else {
			if (data.success) {
				res.redirect('/longroom/discussion/' + data.id);
			} else {
				res.render('create_form', {
					title: 'Alphaville Longroom',
					h1: 'Write a new post',
					validation: data.validation || null,
					postData: req.body
				});
			}
		}
	}
}

function deleteUploadedFiles (userId, files) {
	files.forEach((uploadedFile) => {
		s3.deleteObject({
			Bucket: process.env.S3_AWS_BUCKET_NAME,
			Key: userId + '_' + uploadedFile.filename
		}, (err) => {
			if (err) {
				console.log('error reverting file', uploadedFile.filename, err);
			}
		});
	});
}

function revertDbInserts (discusssionId) {
	db.none('DELETE FROM files WHERE discussion_id = $1', discusssionId);
	db.none('DELETE FROM discussions WHERE id = $1', discusssionId);
}

exports.post = (req, res) => {
	const validation = {};

	userMiddleware(req, res, () => {
		if (!req.userUuid) {
			return res.json({
				success: false,
				genericMessage: "You do not have permission to create a post/upload a document."
			});
		} else {
			const postType = req.body.postType;

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
						validation.files[fileInfo.fileUploadFormElId] = "Please name a source for the uploaded file.";
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
					user_id: req.userUuid,
					published: req.body.publish ? true : false,
					published_at: req.body.publish ? new Date() : null
				}).catch(err => {
					// post save failed
					err = err || new Error("Post save failed");
					err.postSaveFailed = true;

					throw err;
				}).then(postId => {
					const getTagQueries = function (transaction) {
						const tags = req.body.tags.trim().split(",");

						return Promise.all(tags.map(tag => {
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
										post_id: postId
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
	});
};
