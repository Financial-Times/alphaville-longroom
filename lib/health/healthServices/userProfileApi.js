'use strict';

const _ = require('lodash');
const url = require('url');
const fetch = require('node-fetch');

const userProfileApiUrl = url.parse(process.env['USER_PROFILE_API_URL']);

const healthCheckModel = {
	id: 'user-profile-api',
	name: 'User Profile API',
	ok: false,
	technicalSummary: "Used in order to fetch basic information about the user.",
	severity: 2,
	businessImpact: "New members are not able to join.",
	checkOutput: "",
	panicGuide: `Check the healthcheck of the service (https://${userProfileApiUrl.host}/__health)`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		fetch(`https://${userProfileApiUrl.host}/__gtg`)
			.then(res => {
				if (!res.ok) {
					throw new Error("Service unavailable");
				}

				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				currentHealth.ok = false;
				currentHealth.checkOutput = "User Profile API is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
