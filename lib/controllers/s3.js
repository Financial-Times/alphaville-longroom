const aws = require('../services/aws');

exports.sign = function (req, res) {
	const s3 = new aws.S3();

	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];

	if (!fileName || !fileType) {
		res.status(400);
		res.json({
			status: 'error',
			error: 'File name or file type is missing.'
		});
		return;
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

		const returnData = {
			signedRequest: data,
			url: `https://${process.env.S3_AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
		};
		res.json(returnData);
	});
};

exports.delete = function (req, res) {
	const s3 = new aws.S3();

	const fileName = req.body['file-name'];

	if (!fileName) {
		res.status(400);
		res.json({
			status: 'error',
			error: 'File name is missing.'
		});
		return;
	}

	s3.deleteObject({
		Bucket: process.env.S3_AWS_BUCKET_NAME,
		Key: fileName
	}, (err) => {
		if (err) {
			console.log('error deleting file', fileName, err);
			res.status(503);
			res.json({
				status: 'error',
				error: err
			});
			return;
		}

		res.json({
			status: 'ok'
		});
	});
};
