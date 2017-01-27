const db = require('../services/db').db;
const objectInArray = require('../utils/objectInArray');
const s3 = require('../services/s3');

const MAX_TAGS = 3;
const MAX_TAG_LENGTH = 30;

exports.getForm = function (req, res, next) {
	if (req.params.id) {
		return db.post.selectById(req.params.id)
			.then(post => {
				if (post && post.length === 1) {
					post = post[0];
				}

				if (!post || !post.title) {
					return next();
				}

				if (!req.userData || (req.userData.user_id !== post.user_id && !req.userData.is_editor)) {
					const err = new Error('Permission denied');
					err.status = 401;
					return next(err);
				}

				let renderConfig;
				if (post.post_type === 'post') {
					renderConfig = {
						title: 'Write a post | Alphaville Longroom',
						postType: 'post',
						isPostForm: true
					};
				} else {
					renderConfig = {
						title: `Upload document | Alphaville Longroom`,
						postType: 'document',
						isDocumentForm: true
					};
				}

				renderConfig.postId = post.id;
				renderConfig.postTitle = post.title;
				renderConfig.postSummary = post.summary;
				renderConfig.postTags = post.tags;
				renderConfig.postFiles = post.files;

				if (!post.published) {
					renderConfig.postDraft = true;
				}

				res.render('edit_form', renderConfig);
			}).
			catch(err => {
				console.log('Error fetching the content', err);
				next(err);
			});
	} else {
		next();
	}
};

exports.process = function (req, res, next) {
	const validation = {};

	if (req.params.id) {
		return db.post.selectById(req.params.id)
			.then(originalPost => {
				if (originalPost && originalPost.length === 1) {
					originalPost = originalPost[0];
				}

				if (!req.userData || (req.userData.user_id !== originalPost.user_id && !req.userData.is_editor)) {
					res.status(401);
					return res.json({
						success: false,
						genericMessage: "You do not have permission to create a post/upload a document."
					});
				} else {
					const postType = req.body.postType;
					let tags;

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
							validation.tags = `Maximum number of ${MAX_TAGS} tags can be selected.`;
						} else {
							tags.forEach(tag => {
								if (tag.length > MAX_TAG_LENGTH) {
									validation.tags = `Tags cannot exceed ${MAX_TAG_LENGTH} characters.`;
								}
							});
						}
					}

					if (postType === 'post' && (!req.body.summary || !req.body.summary.trim())) {
						validation.summary = 'Summary is required.';
					}

					if (postType === 'document' && (!req.body.files || !req.body.files.filter(file => file.fileStatus === 'existing' || file.fileStatus === 'new').length)) {
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
						const getPostUpdateQuery = function (transaction) {
							return transaction.post.update(originalPost.id, {
								title: req.body.title.trim(),
								summary: req.body.summary.trim(),
								post_type: postType,
								user_id: req.userData.user_id,
								published: req.body.publish ? true : originalPost.published,
								published_at: req.body.publish ? new Date() : null
							});
						};

						const getTagQueries = function (transaction) {
							const tags = req.body.tags.trim().split(",").map(tag => tag.trim());

							const newTags = [];
							const tagsToRemove = [];
							const tagsToUpdateIndex = [];

							tags.forEach(tag => {
								if (tag) {
									const existingTag = objectInArray.getObjectInArray(originalPost.tags, {
										key: 'name',
										value: tag
									});

									if (!existingTag) {
										newTags.push(tag);
									} else {
										tagsToUpdateIndex.push(existingTag);
									}
								}
							});

							originalPost.tags.forEach(originalTag => {
								if (tags.indexOf(originalTag.name) === -1) {
									tagsToRemove.push(originalTag);
								}
							});

							return Promise.all(newTags.map(tag => {
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
										post_id: originalPost.id,
										index: tags.indexOf(tag)
									}));
								});
							})).then(queries => {
								return [
									...queries,
									...(tagsToRemove.map(tag => {
										return transaction.tagToPost.deleteOne(originalPost.id, tag.id);
									})),
									...(tagsToUpdateIndex.map(tag => {
										return transaction.tagToPost.updateIndex(originalPost.id, tag.id, tags.indexOf(tag.name));
									}))
								];
							});
						};

						const getFileQueries = function (transaction) {
							const files = req.body.files;

							const newFiles = [];
							const filesToRemove = [];
							const updateSource = [];

							files.forEach(file => {
								if (file.fileStatus === 'new') {
									newFiles.push(file);
								}

								if (file.fileStatus === 'remove') {
									const existingFile = objectInArray.getObjectInArray(originalPost.files, {
										key: 'id',
										value: file.fileId
									});

									filesToRemove.push(existingFile);
								}

								if (file.fileStatus === 'existing') {
									const existingFile = objectInArray.getObjectInArray(originalPost.files, {
										key: 'id',
										value: file.fileId
									});

									if (existingFile && existingFile.source !== file.source) {
										updateSource.push(file);
									}
								}
							});

							return Promise.all([
								Promise.all(newFiles.map(file => {
									if (file && file.fileId) {
										return db.file.selectById(file.fileId).then(fileEntry => {
											if (fileEntry) {
												return Promise.resolve([
													transaction.file.addSource({
														source: file.source.trim(),
														id: fileEntry.id
													}),
													transaction.file.attachToPost({
														post_id: originalPost.id,
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
								})),
								Promise.all(filesToRemove.map(file => {
									return s3.deleteObject(file.name);
								})).then(() => {
									return filesToRemove.map(file => transaction.file.delete(file.id));
								})
							]).then(results => {
								// flatten the array
								return [].concat.apply([], results, updateSource.map(file => {
									return transaction.file.addSource({
										source: file.source.trim(),
										id: file.fileId
									});
								}));
							});
						};

						return db.tx(transaction => {
							return Promise.all([
								getTagQueries(transaction),
								getFileQueries(transaction)
							]).then(queries => {
								return transaction.batch([getPostUpdateQuery(transaction), ...queries[0]]);
							});
						}).then(() => {
							return originalPost.id;
						}).catch(err => {
							err = err || new Error("Transaction failed");

							throw err;
						});
					}
				}
			})
			.then((postId) => {
				res.json({
					success: true,
					postId: postId,
					url: '/longroom/content/' + postId
				});
			})
			.catch(err => {
				console.log('Error while editing post', err);

				res.json({
					success: false,
					genericMessage: "An error occured. Please try again later."
				});
			});
	} else {
		next();
	}
};
