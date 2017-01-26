"use strict";


const healthServices = [
	require('./healthServices/postgresDB'),
	require('./healthServices/worker'),
	require('./healthServices/userSessionApi'),
	require('./healthServices/recentCommentsApi'),
	require('./healthServices/sudsApi'),
	require('./healthServices/userProfileApi'),
	require('./healthServices/awsS3'),
	require('./healthServices/als')
];

let lastUpdated;
let lastResults;

let checkInProgress = false;
const check = function () {
	if (checkInProgress) {
		return checkInProgress;
	}

	lastUpdated = new Date().getTime();

	const checksToRun = [];
	healthServices.forEach(function (healthService) {
		checksToRun.push(healthService.getHealth());
	});

	checkInProgress = Promise.all(checksToRun).then((results) => {
		lastUpdated = new Date().getTime();
		lastResults = results;

		checkInProgress = false;
		return results;
	}).catch((err) => {
		checkInProgress = false;
		throw err;
	});
	return checkInProgress;
};

exports.getChecks = function () {
	if (lastResults && lastUpdated && (new Date().getTime() - lastUpdated < 60000)) {
		return new Promise((resolve) => {
			resolve(lastResults);
		});
	} else {
		return check();
	}
};
