const sql = require('../sql').post;

module.exports = (rep) => {
	return {
		selectAll: () => rep.any(sql.selectAll),
		selectById: (id) => rep.one(sql.selectById, {id: id}),
		selectByUserId: (userId) => rep.one(sql.selectByUserId, {user_id: userId}),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values),
		publish: (id) => rep.none(sql.publish, {id: id})
	};
};
