const sql = require('../sql').displayNames;

module.exports = (rep) => {
	return {
		insert: (user_id, display_name) => rep.oneOrNone(sql.insert, {user_id, display_name}),
		updateDisplayName: (user_id, display_name) => rep.one(sql.updateDisplayName, {user_id, display_name}),
		deleteByUserId: (user_id) => rep.none(sql.deleteByUserId, {user_id}),
		selectById: (user_id) => rep.any(sql.selectByUserId, {user_id})
	};
};
