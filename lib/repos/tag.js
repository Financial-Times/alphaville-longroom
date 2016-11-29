const sql = require('../sql').tag;

module.exports = (rep) => {
	return {
		selectByName: (name) => rep.one(sql.selectByName, {name: name}),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values)
	};
};
