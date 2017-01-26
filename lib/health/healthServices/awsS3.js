const _ = require('lodash');
const s3 = require('../../services/s3');

const healthCheckModel = {
	id: 'aws-s3',
	name: 'AWS S3',
	ok: false,
	technicalSummary: "Used to store files (upload and download).",
	severity: 2,
	businessImpact: "New files cannot be uploaded, existing files cannot be downloaded.",
	checkOutput: "",
	panicGuide: `Check the health of AWS services. Check the correctness and validity of S3 keys.`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		s3.fileExists('dummy')
			.then(exists => {
				if (exists !== true && exists !== false) {
					throw new Error("Service unavailable");
				}

				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				currentHealth.ok = false;
				currentHealth.checkOutput = "AWS S3 is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
