const aws = require('../services/aws');
const s3 = new aws.S3();

const defaultS3Params = {
	Bucket: process.env.S3_AWS_BUCKET_NAME
};

exports.getSignedUrl = function (fileName, fileType) {
	return new Promise((resolve, reject) => {
		const s3Params = Object.assign({}, defaultS3Params, {
			Key: fileName,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read'
		});

		s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(data);
		});
	});
};

exports.fileExists = function (fileName) {
	return new Promise((resolve, reject) => {
		const s3Params = Object.assign({}, defaultS3Params, {
			Key: fileName
		});

		s3.headObject(s3Params, (err) => {
			if (err) {
				if (err.code === 'NotFound') {
					resolve(false);
				} else {
					reject(err);
				}

				return;
			}

			resolve(true);
		});
	});
};

exports.deleteObject = function (fileName) {
	return new Promise((resolve, reject) => {
		const s3Params = Object.assign({}, defaultS3Params, {
			Key: fileName
		});

		s3.deleteObject(s3Params, (err) => {
			if (err) {
				reject(err);
				return;
			}

			resolve();
		});
	});
};
