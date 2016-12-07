const aws = require('../services/aws');
const db = require('../services/db').db;
const fileTypes = require('../utils/fileTypes');

const maxFileSize = 100 * 1024 * 1024; // 100 MB

exports.sign = function (req, res) {
	if (!req.userUuid) {
		res.json(req, res, {
			status: 'error',
			error: "You do not have permission to create a discussion."
		});
	} else {
		const s3 = new aws.S3();

		const fileName = req.query['file-name'];
		const fileType = req.query['file-type'];
		const fileSize = req.query['file-size'];

		if (!fileName || !fileType || !fileSize) {
			res.status(400);
			res.json({
				status: 'error',
				error: 'Some file information is missing.'
			});
			return;
		}

		if (fileTypes.allowed.indexOf(fileType) === -1) {
			res.status(400);
			res.json({
				status: 'error',
				error: 'The selected document type is not allowed.'
			});
			return;
		}

		if (fileSize > maxFileSize) {
			res.status(400);
			res.json({
				status: 'error',
				error: 'The selected document is too large.'
			});
		}

		const s3Params = {
			Bucket: process.env.S3_AWS_BUCKET_NAME,
			Key: fileName,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read'
		};

		s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if (err) {
				console.log(err);
				res.status(503);
				res.json({
					status: 'error',
					error: err
				});
				return;
			}

			db.file.insert({
				name: fileName,
				type: fileType,
				size: fileSize,
				user_id: req.userUuid
			}).then((id) => {
				res.json({
					fileId: id,
					signedRequest: data,
					url: `https://${process.env.S3_AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
				});
			}).catch((err) => {
				console.log(err);

				res.status(503);
				res.json({
					status: 'error',
					error: err
				});
			});
		});
	}
};


exports.delete = function (req, res) {
	let fileId = req.body['file-id'];

	if (!fileId || isNaN(fileId)) {
		res.status(400);
		res.json({
			status: 'error',
			error: 'File id is missing or invalid.'
		});
		return;
	}

	fileId = parseInt(fileId, 10);

	db.file.selectById(fileId).then((result) => {
		if (result && result.name) {
			if (result.user_id !== req.userUuid) {
				res.status(401);
				res.json({
					status: 'error',
					error: 'You do not have permission to delete this file.'
				});
				return;
			}

			const s3 = new aws.S3();

			s3.deleteObject({
				Bucket: process.env.S3_AWS_BUCKET_NAME,
				Key: result.name
			}, (err) => {
				if (err) {
					console.log('error deleting file', result.name, err);
					res.status(503);
					res.json({
						status: 'error',
						error: err
					});
					return;
				}

				db.file.delete(fileId).then(() => {
					res.json({
						status: 'ok'
					});
				}).catch((err) => {
					console.log(err);

					res.status(503);
					res.json({
						status: 'error',
						error: err
					});
				});
			});
		} else {
			throw new Error("File not found.");
		}
	}).catch((err) => {
		console.log(err);

		res.status(503);
		res.json({
			status: 'error',
			error: err
		});
	});
};
