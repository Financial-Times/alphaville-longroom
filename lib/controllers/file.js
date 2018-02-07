const db = require('../services/db').db;
const fileTypes = require('../utils/fileTypes');
const https = require('https');
const imageTypes = require('../utils/imageTypes');
const s3 = require('../services/s3');
const detectFileType = require('file-type');

const maxFileSize = 100 * 1024 * 1024; // 100 MB
const maxImageSize = 5 * 1024 * 1024; // 5 MB

function getUniqueFileName (originalFileName, index) {
	const matches = originalFileName.match(/^([^\\]*)\.(\w+)$/);
	let fileName;
	let extension;


	if (matches) {
		fileName = matches[1];
		extension = matches[2];
	}

	const actualFileName = index ? `${fileName}(${index})${extension ? '.' + extension : ''}` : originalFileName;

	return s3.fileExists(actualFileName).then(exists => {
		if (!exists) {
			return actualFileName;
		} else {
			return getUniqueFileName(originalFileName, index ? index + 1 : 1);
		}
	});
}

exports.upload = function (req, res) {
	if (!req.userData) {
		res.status(401);
		res.json({
			status: 'error',
			error: "You do not have permission to create a discussion."
		});
	} else {
		const file = req.file;
		const fileName = file.originalname;
		const fileSize = file.size;
		const fileType = detectFileType(file.buffer);
		const uploadType = req.query['upload-type'] || 'attachment';

		if (!fileName || !fileSize) {
			res.status(400);
			res.json({
				status: 'error',
				error: 'Some file information is missing.'
			});
			return;
		}

		if (uploadType === 'attachment') {
			if (!fileType || fileTypes.allowed.indexOf(fileType.mime) === -1) {
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
		}

		if (uploadType === 'embedded') {
			if (!fileType || imageTypes.allowed.indexOf(fileType.mime) === -1) {
				res.status(400);
				res.json({
					status: 'error',
					error: 'The selected image type is not allowed.'
				});
				return;
			}

			if (fileSize > maxImageSize) {
				res.status(400);
				res.json({
					status: 'error',
					error: 'The selected image is too large.'
				});
			}
		}

		getUniqueFileName(fileName).then(uniqueFileName => {
			const extension = fileTypes.extensions[fileType.mime];

			return db.file.insert({
				name: uniqueFileName,
				type: fileType.mime,
				ext: extension,
				size: fileSize,
				user_id: req.userData.user_id,
				is_embedded: uploadType === 'embedded' ? true : false
			}).then((id) => {
				s3.putObject(uniqueFileName, file.buffer)
					.then(() => {
						res.json({
							fileId: id,
							savedFileName: uniqueFileName,
							fileType: fileType.mime,
							url: `${process.env.APP_URL}/files/${uniqueFileName}`
						});
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

exports.sign = function (req, res) {
	if (!req.userData) {
		res.status(401);
		res.json({
			status: 'error',
			error: "You do not have permission to create a discussion."
		});
	} else {
		const fileName = req.query['file-name'];
		const fileType = req.query['file-type'];
		const fileSize = req.query['file-size'];
		const uploadType = req.query['upload-type'] || 'attachment';

		if (!fileName || !fileType || !fileSize) {
			res.status(400);
			res.json({
				status: 'error',
				error: 'Some file information is missing.'
			});
			return;
		}

		if (uploadType === 'attachment') {
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
		}

		if (uploadType === 'embedded') {
			if (imageTypes.allowed.indexOf(fileType) === -1) {
				res.status(400);
				res.json({
					status: 'error',
					error: 'The selected image type is not allowed.'
				});
				return;
			}

			if (fileSize > maxImageSize) {
				res.status(400);
				res.json({
					status: 'error',
					error: 'The selected image is too large.'
				});
			}
		}




		getUniqueFileName(fileName).then(uniqueFileName => {
			const extension = fileTypes.extensions[fileType];

			return s3.getSignedUrl(uniqueFileName, fileType).then((data) => {
				return db.file.insert({
					name: uniqueFileName,
					type: fileType,
					ext: extension,
					size: fileSize,
					user_id: req.userData.user_id,
					is_embedded: uploadType === 'embedded' ? true : false
				}).then((id) => {
					res.json({
						fileId: id,
						savedFileName: uniqueFileName,
						fileType: fileType,
						signedRequest: data,
						url: `${process.env.APP_URL}/files/${uniqueFileName}`
					});
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
	if (!req.userData) {
		res.status(401);
		return res.json({
			status: 'error',
			error: "You do not have permission."
		});
	}

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
			if (!req.userData || (req.userData.user_id !== result.user_id && !req.userData.is_editor)) {
				res.status(401);
				res.json({
					status: 'error',
					error: 'You do not have permission to delete this file.'
				});
				return;
			}

			return s3.deleteObject(result.name).then(() => {
				return db.file.delete(fileId).then(() => {
					res.json({
						status: 'ok'
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

exports.download = function (req, res, next) {

	if (!req.params.fileName) {
		return next();
	}

	// Ensure users are logged in to download.
	if (!req.userData) {
		return res.sendStatus(401);
	}

	s3.fileExists(req.params.fileName).then(exists => {
		if (!exists) {
			console.log(req.params.fileName, 'does not exist');
			return next();
		} else {
			// Proxy the download through the application.
			https.get(`https://${process.env.CLOUDFRONT_HOST}/${req.params.fileName}`, (proxy) => {
				proxy.pipe(res);
			});
		}
	}).catch(next);
};

exports.oldAttachments = function (req, res, next) {
	const fileName = req.path.substr(req.path.lastIndexOf('/') + 1);

	if (!fileName) {
		return next();
	}

	// Ensure users are logged in to download.
	if (!req.userData) {
		return res.sendStatus(401);
	}

	res.redirect(`https://${process.env.CLOUDFRONT_HOST}/${fileName}`);
};
