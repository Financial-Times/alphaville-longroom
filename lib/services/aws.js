const aws = require('aws-sdk');

aws.config = {
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION,
	sslEnabled: (process.env.AWS_SSL_ENABLED === "true"),
	maxRetries: process.env.AWS_MAX_RETRIES
};

module.exports = aws;
