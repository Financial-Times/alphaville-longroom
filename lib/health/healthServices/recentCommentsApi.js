'use strict';

const _ = require('lodash');

const recentCommentsApi = require('../../services/recentComments');
const recentCommentsApiUrl = process.env.RECENT_COMMENTS_API_URL;

const healthCheckModel = {
	id: 'recent-comments-api',
	name: 'Recent comments API',
	ok: false,
	technicalSummary: "Used in order to populate the overheard component.",
	severity: 3,
	businessImpact: "Overheard component will be hidden.",
	checkOutput: "",
	panicGuide: `Check the healthcheck of the service (https://${recentCommentsApiUrl}/__health)`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		recentCommentsApi.get()
			.then(() => {
				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				if (err && err.status && err.status < 500) {
					currentHealth.ok = true;
					resolve(_.omit(currentHealth, ['checkOutput']));
					return;
				}

				currentHealth.ok = false;
				currentHealth.checkOutput = "Recent comments API is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
