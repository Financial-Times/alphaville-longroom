const aws = require('aws-sdk');

aws.config = {
	accessKeyId: process.env.S3_AWS_ACCESS_KEY,
	secretAccessKey: process.env.S3_AWS_SECRET_KEY,
	region: process.env.S3_AWS_REGION,
	sslEnabled: process.env.S3_AWS_SSL_ENABLED === "true" ? true : false,
	maxRetries: process.env.S3_AWS_MAX_RETRIES
};

module.exports = aws;
