const sql = require('../sql').cleanupStatus;

module.exports = (rep) => {
	return {
		get: () => rep.one(sql.get),
		update: (lastRun) => rep.none(sql.update, {
			last_run: lastRun
		})
	};
};
