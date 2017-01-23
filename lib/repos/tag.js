const sql = require('../sql').tag;

module.exports = (rep) => {
	return {
		selectByName: (name) => rep.oneOrNone(sql.selectByName, {name: name}),
		selectById: (id) => rep.oneOrNone(sql.selectById, {id: id}),
		selectSuggestion: (term) => rep.any(sql.selectSuggestion, {term: term}),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id)
	};
};
