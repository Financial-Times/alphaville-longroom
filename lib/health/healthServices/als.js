'use strict';

const _ = require('lodash');
const url = require('url');
const fetch = require('node-fetch');

const alsUrl = url.parse(process.env['ALS_URL']);

const healthCheckModel = {
	id: 'als',
	name: 'A license service',
	ok: false,
	technicalSummary: "Used for granting selective access to users.",
	severity: 1,
	businessImpact: "Members can't access the page. New members cannot be accepted.",
	checkOutput: "",
	panicGuide: `Check the healthcheck of the service (https://${alsUrl.host}/__health)`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		fetch(`https://${alsUrl.host}/__gtg`)
			.then(res => {
				if (!res.ok) {
					throw new Error("Service unavailable");
				}

				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch((err) => {
				currentHealth.ok = false;
				currentHealth.checkOutput = "ALS is unreachable. Error: " + (err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
};
