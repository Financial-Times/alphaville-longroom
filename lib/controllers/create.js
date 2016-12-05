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
				res.json({
					success: true,
					id: 'something',
					url: '/longroom/content/something'
				});
			}
/*
			${title},
	${summary},
	${post_type},
	${user_id},
	${published},
	NOW(),
	${published_at}
*/

		}
	});
};
