const sql = require('../sql').userDetails;

module.exports = (rep) => {
	return {
		add: (values) => rep.one(sql.add, values, user => user.user_id),
		deleteById: (user_id) => rep.any(sql.deleteById, {user_id})
	};
};
