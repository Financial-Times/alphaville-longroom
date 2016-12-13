const aws = require('../services/aws');
const db = require('../services/db').db;
const fileTypes = require('../utils/fileTypes');

const maxFileSize = 100 * 1024 * 1024; // 100 MB


function getUniqueFileName (originalFileName, index) {
	return new Promise((resolve, reject) => {
		const matches = originalFileName.match(/^([^\\]*)\.(\w+)$/);
		let fileName;
		let extension;


		if (matches) {
			fileName = matches[1];
			extension = matches[2];
		}

		const actualFileName = index ? `${fileName}(${index})${extension ? '.' + extension : ''}` : originalFileName;

		const params = {
			Bucket: process.env.S3_AWS_BUCKET_NAME,
			Key: actualFileName
		};

		const s3 = new aws.S3();

		s3.headObject(params, (err) => {
			if (err) {
				if (err.code === 'NotFound') {
					resolve(actualFileName);
					return;
				} else {
					reject(err);
				}
			}

			resolve(getUniqueFileName(originalFileName, index ? index + 1 : 1));
		});
	});
}

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


		getUniqueFileName(fileName).then(uniqueFileName => {
			const extension = fileTypes.extensions[fileType];

			const s3Params = {
				Bucket: process.env.S3_AWS_BUCKET_NAME,
				Key: uniqueFileName,
				Expires: 60,
				ContentType: fileType,
				ACL: 'public-read'
			};

			s3.getSignedUrl('putObject', s3Params, (err, data) => {
				if (err) {
					throw err;
				}

				db.file.insert({
					name: uniqueFileName,
					type: fileType,
					ext: extension,
					size: fileSize,
					user_id: req.userUuid
				}).then((id) => {
					res.json({
						fileId: id,
						savedFileName: uniqueFileName,
						signedRequest: data,
						url: `https://${process.env.S3_AWS_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`
					});
				}).catch((err) => {
					throw err;
				});
			});
		}).catch((err) => {
			console.log(err);

			res.status(503);
			res.json({
				status: 'error',
				error: err
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
