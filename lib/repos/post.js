const sql = require('../sql').post;

module.exports = (rep) => {
	return {
		selectAll: () => rep.any(sql.selectAll),
		selectById: (id) => rep.oneOrNone(sql.selectById, {id: id}),
		selectByUserId: (userId) => rep.oneOrNone(sql.selectByUserId, {user_id: userId}),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id),
		publish: (id) => rep.none(sql.publish, {id: id})
	};
};
