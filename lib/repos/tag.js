const sql = require('../sql').tag;

module.exports = (rep) => {
	return {
		selectByName: (name) => rep.oneOrNone(sql.selectByName, {name: name}),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id)
	};
};
