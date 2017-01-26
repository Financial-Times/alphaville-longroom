const _ = require('lodash');
const db = require('../../services/db').db;

const healthCheckModel = {
	id: 'worker',
	name: 'Worker',
	ok: false,
	technicalSummary: "Worker cleans up orphaned files (uploaded files, but not saved the post).",
	severity: 3,
	businessImpact: "Orphaned files are not deleted.",
	checkOutput: "",
	panicGuide: "Check the status of the worker dyno on heroku, try to restart and check the logs while restarting.",
	lastUpdated: new Date().toISOString()
};

exports.getHealth = function () {
	return new Promise((resolve) => {
		const currentHealth = _.clone(healthCheckModel);

		db.cleanupStatus.get().then(status => {
			if (new Date().getTime() - status.last_run.getTime() < 15 * 60 * 1000) {
				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			} else {
				currentHealth.ok = false;
				currentHealth.checkOutput = 'timeout';
				resolve(currentHealth);
			}
		}).catch(err => {
			currentHealth.ok = false;
			currentHealth.checkOutput = "DB call to cleanup status failed or the data is missing. Error: " + (err && err.message ? err.message : '');
			resolve(currentHealth);
		});
	});
};
