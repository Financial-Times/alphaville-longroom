'use strict';

const _ = require('lodash');

const sudsApi = require('../../services/suds');
const sudsApiUrl = process.env.SUDS_API_URL;

const healthCheckModel = {
	id: 'suds',
	name: 'Session user data service',
	ok: false,
	technicalSummary: "Used for setting user's pseudonym.",
	severity: 2,
	businessImpact: "Users without pseudonym won't be able to access the application.",
	checkOutput: "",
	panicGuide: `Check the healthcheck of the service (https://${sudsApiUrl}/__health)`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		sudsApi.getPseudonym([process.env.HEALTH_USER_ID])
			.then(() => {
				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				if (err && err.response && err.response.status === 404) {
					currentHealth.ok = true;
					resolve(_.omit(currentHealth, ['checkOutput']));
					return;
				}

				currentHealth.ok = false;
				currentHealth.checkOutput = "SUDS API is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
