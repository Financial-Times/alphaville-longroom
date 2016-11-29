"use strict";

const fileTypes = require('../utils/fileTypes');
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
	let success = true;

	userMiddleware(req, res, () => {
		if (!req.userUuid) {
			return res.json({
				success: false,
				genericMessage: "You do not have permission to create a post/upload a document."
			});
		} else {
			if (!req.body['post-title'] || !req.body['post-title'].trim()) {
				validation['post-title'] = 'Title is required.';
			}

			if (!req.body['post-tags'] || !req.body['post-tags'].trim()) {
				validation['post-tags'] = 'Topic tags are required.';
			}

			if (!req.body['post-tags'] || !req.body['post-tags'].trim()) {
				validation['post-tags'] = 'Topic tags are required.';
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
