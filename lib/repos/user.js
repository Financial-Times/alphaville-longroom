const sql = require('../sql').user;

module.exports = (rep) => {
	return {
		join: (values) => rep.one(sql.join, values, user => user.user_id),
		find: (id) => rep.oneOrNone('SELECT * FROM users WHERE user_id = $1', id)
	};
};
