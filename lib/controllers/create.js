"use strict";

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const aws = require('../services/aws');
const s3 = new aws.S3();
const async = require('async');
const userMiddleware = require('../middlewares/user');
const fileTypes = require('../utils/fileTypes');

const db = require('../services/db').db;

const limits = {
	maxFiles: parseInt(process.env.MAXIMUM_NUMBER_OF_FILES, 10) || 5
};

exports.get = (req, res) => {
	res.render('create_form', {
		title: 'Alphaville Longroom',
		h1: 'Write a new post'
	});
};

const storageDirPath = path.join(__dirname, '../..', 'tmp');
const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, storageDirPath);
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	}
});

const upload = multer({
	storage: storage,
	limits: {
		files: limits.maxFiles
	}
});

if (!fs.existsSync(storageDirPath)) {
	fs.mkdirSync(storageDirPath);
}



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

function deleteLocalFiles (files, excludeFiles) {
	if (!excludeFiles) {
		excludeFiles = [];
	}

	files.forEach((file) => {
		if (excludeFiles.indexOf(file) === -1) {
			fs.unlinkSync(file.path);
		}
	});
}

function revertDbInserts (discusssionId) {
	db.none('DELETE FROM files WHERE discussion_id = $1', discusssionId);
	db.none('DELETE FROM discussions WHERE id = $1', discusssionId);
}

exports.post = (req, res) => {
	const validation = {};
	let success = true;

	console.log('belep');

	userMiddleware(req, res, () => {
		if (!req.userUuid) {
			postResponse(req, res, {
				success: false,
				genericMessage: "You do not have permission to create a discussion."
			});
		} else {
			console.log('user identified');
			upload.array('post-file')(req, res, function (err) {
				if (!req.body['post-title']) {
					success = false;
					validation['post-title'] = 'Title is blank.';
				}

				if (!req.body['post-content']) {
					success = false;
					validation['post-content'] = 'Content is blank.';
				}

				console.log('files uploaded');

				if (err) {
					success = false;
					validation['post-file'] = err.message;
				} else {
					const notAllowedFiles = [];
					req.files.forEach((file) => {
						if (fileTypes.allowed.indexOf(file.mimetype) === -1) {
							notAllowedFiles.push(file);
						}
					});

					if (notAllowedFiles.length) {
						success = false;
						if (!validation['post-file']) {
							validation['post-file'] = "";
						} else {
							validation['post-file'] += " ";
						}

						validation['post-file'] += "The following files are not allowed to be uploaded because of their types: ";
						notAllowedFiles.forEach((file) => {
							validation['post-file'] += file.filename + ', ';
						});
						validation['post-file'] = validation['post-file'].substr(0, validation['post-file'].length - 2);
					}
				}


				if (!success) {
					deleteLocalFiles(req.files);

					postResponse(req, res, {
						success: false,
						validation: validation
					});
					return;
				} else {
					const filesUploadedSuccessfully = [];
					const fileSaveFunctions = [];

					db.one('INSERT INTO discussions (user_id, title, content, created_at) VALUES (${user_id}, ${title}, ${content}, ${created_at}) returning id', {
						user_id: req.userUuid,
						title: req.body['post-title'],
						content: req.body['post-content'],
						created_at: new Date()
					}).then((discussionInsert) => {
						const discusssionId = discussionInsert.id;

						req.files.forEach((file) => {
							fileSaveFunctions.push((callback) => {
								fs.readFile(file.path, (err, data) => {
									s3.putObject({
										Bucket: process.env.S3_AWS_BUCKET_NAME,
										Key: req.userUuid +'_'+ file.filename,
										Body: data
									}, (err) => {
										if (err) {
											console.log(err);
											callback(err);
											return;
										}

										filesUploadedSuccessfully.push(file);
										fs.unlinkSync(file.path);

										db.none('INSERT INTO files (discussion_id, saved_filename, original_filename, mimetype, size) VALUES (${discussion_id}, ${saved_filename}, ${original_filename}, ${mimetype}, ${size})', {
											discussion_id: discusssionId,
											saved_filename: req.userUuid +'_'+ file.filename,
											original_filename: file.filename,
											mimetype: file.mimetype,
											size: file.size
										}).then(() => {
											callback();
										}).catch((errFile) => {
											console.log('error', errFile);
											callback(errFile);
										});
									});
								});
							});
						});

						async.series(fileSaveFunctions, (err) => {
							if (err) {
								console.log('revert');
								// revert the file upload
								deleteUploadedFiles(req.userUuid, filesUploadedSuccessfully);
								deleteLocalFiles(req.files, filesUploadedSuccessfully);
								revertDbInserts(discusssionId);

								postResponse(req, res, {
									success: false,
									genericMessage: 'An error occured while saving the files. Please try again later.'
								});
								return;
							}

							postResponse(req, res, {
								success: true,
								id: discusssionId
							});
						});
					}).catch((err) => {
						console.log(err);
						deleteLocalFiles(req.files, filesUploadedSuccessfully);

						postResponse(req, res, {
							success: false,
							genericMessage: 'An error occured while saving the discussion. Please try again later.'
						});
					});
				}
			});
		}
	});
};
