const db = require('../services/db').db;
const fileTypes = require('../utils/fileTypes');
const s3 = require('../services/s3');

const maxFileSize = 100 * 1024 * 1024; // 100 MB


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

exports.sign = function (req, res) {
	if (!req.userUuid) {
		res.json({
			status: 'error',
			error: "You do not have permission to create a discussion."
		});
	} else {
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

			return s3.getSignedUrl(uniqueFileName, fileType).then((data) => {
				return db.file.insert({
					name: uniqueFileName,
					type: fileType,
					ext: extension,
					size: fileSize,
					user_id: req.userUuid
				}).then((id) => {
					res.json({
						fileId: id,
						savedFileName: uniqueFileName,
						fileType: fileType,
						signedRequest: data,
						url: `https://${process.env.S3_AWS_BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`
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

	s3.fileExists(req.params.fileName).then(exists => {
		if (!exists) {
			console.log(req.params.fileName, 'does not exist');
			return next();
		} else {
			res.redirect(`https://${process.env.CLOUDFRONT_HOST}/${req.params.fileName}`);
		}
	}).catch(next);
};

exports.oldAttachments = function (req, res, next) {
	console.log('enters oldAttachments controller');

	if (!req.params.filePath) {
		console.log('file path not provided.');

		return next();
	}

	console.log('req.params.filePath', req.params.filePath);

	const fileName = req.filePath.substr(req.params.filePath.lastIndexOf('/'));

	console.log('fileName', fileName);

	res.redirect(`https://${process.env.CLOUDFRONT_HOST}/${fileName}`);
};
