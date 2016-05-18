"use strict";

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const aws = require('../services/aws');
const s3 = new aws.S3();
const async = require('async');

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
				res.send("OK");
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
};

exports.post = (req, res) => {
	const validation = {};
	let success = true;

	upload.array('post-file')(req, res, function (err) {
		if (!req.body['post-title']) {
			success = false;
			validation['post-title'] = 'Title is blank.';
		}

		if (!req.body['post-content']) {
			success = false;
			validation['post-content'] = 'Content is blank.';
		}

		if (err) {
			success = false;
			validation['post-file'] = err.message;
		}

		if (!success) {
			postResponse(req, res, {
				success: false,
				validation: validation
			});
			return;
		} else {
			const filesUploadedSuccessfully = [];
			const fileUploadFunctions = [];

			req.files.forEach((file) => {
				fileUploadFunctions.push((callback) => {
					fs.readFile(file.path, (err, data) => {
						s3.putObject({
							Bucket: process.env.S3_AWS_BUCKET_NAME,
							Key: file.filename,
							Body: data
						}, (err) => {
							if (err) {
								callback(err);
								return;
							}

							filesUploadedSuccessfully.push(file);
							fs.unlinkSync(file.path);

							callback();
						});
					});
				});
			});

			async.series(fileUploadFunctions, (err) => {
				if (err) {
					// revert the file upload
					filesUploadedSuccessfully.forEach((uploadedFile) => {
						s3.deleteObject({
							Bucket: process.env.S3_AWS_BUCKET_NAME,
							Key: uploadedFile.filename
						}, (err) => {
							if (err) {
								console.log('error reverting file', uploadedFile.filename, err);
							}
						});
					});

					req.files.forEach((file) => {
						if (filesUploadedSuccessfully.indexOf(file) === -1) {
							fs.unlinkSync(file.path);
						}
					});

					postResponse(req, res, {
						success: false,
						validation: {
							'post-file': 'File upload failed. Please try again later.'
						}
					});
					return;
				}

				postResponse(req, res, {
					success: true
				});
			});
		}
	});
};
