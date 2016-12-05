const sql = require('../sql').file;

module.exports = (rep) => {
	return {
		selectById: (id) => rep.oneOrNone(sql.selectById, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id),
		delete: (id) => rep.none(sql.delete, {id: id}),
		addSource: (values) => rep.none(sql.addSource, values),
		attachToPost: (values) => rep.none(sql.attachToPost, values)
	};
};
