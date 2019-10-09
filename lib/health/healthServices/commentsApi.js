'use strict';

const _ = require('lodash');

const commentsApi = require('../../services/commentsApi');
const commentsApiUrl = process.env.COMMENTS_API_URL;

const healthCheckModel = {
	id: 'comments-api',
	name: 'Next comments API',
	ok: false,
	technicalSummary: "Used for fetching user's display name.",
	severity: 2,
	businessImpact: "Display names will not be available for the application. Dashboard page will be unreachable.",
	checkOutput: "",
	panicGuide: `Check the healthcheck of the service (https://${commentsApiUrl}/__health)`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		commentsApi.getUser(process.env.HEALTH_USER_ID)
			.then(() => {
				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				currentHealth.ok = false;
				currentHealth.checkOutput = "Comments API is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
