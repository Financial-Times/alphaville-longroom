const Promise = require('bluebird');

const repos = {
	user: require('../repos/user'),
	file: require('../repos/file')
};

const options = {
	promiseLib: Promise,
	extend: obj => {
		obj.user = repos.user(obj, pgp);
		obj.file = repos.file(obj, pgp);
	}
};

const pgp = require('pg-promise')(options);

const db = pgp(process.env.DATABASE_URL + (process.env.DATABASE_SSL === 'true' ? '?ssl=true' : ''));

module.exports = {
	pgp,
	db
};
