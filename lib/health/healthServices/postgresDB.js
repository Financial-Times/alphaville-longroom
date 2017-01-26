"use strict";

const _ = require('lodash');
const db = require('../../services/db').db;

const healthCheckModel = {
	id: 'postgresdb',
	name: 'Postgres DB connection',
	ok: false,
	technicalSummary: "PostgresDB is used to store content, file and user information.",
	severity: 1,
	businessImpact: "The whole site is down.",
	checkOutput: "",
	panicGuide: "Check the status on heroku for PostgresDB, and the connection information within the environment variables.",
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		db.post.selectAll({
			offset: 1,
			limit: 1
		}).then(() => {
			currentHealth.ok = true;
			resolve(_.omit(currentHealth, ['checkOutput']));
		}).catch((err) => {
			currentHealth.ok = false;
			currentHealth.checkOutput = "Connection is down. See the logs of the application on heroku. Error: " + (err && err.message ? err.message : '');
			resolve(currentHealth);
		});

		// timeout after 10 seconds
		setTimeout(function () {
			currentHealth.ok = false;
			currentHealth.checkOutput = 'timeout';
			resolve(currentHealth);
		}, 10000);
	});
};
