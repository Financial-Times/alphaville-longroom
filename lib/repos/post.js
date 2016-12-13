const sql = require('../sql').post;
const postsDbTransformation = require('../dbNormalizers/posts');

module.exports = (rep) => {
	return {
		selectAll: (options) => {
			if (!options) {
				options = {};
			}

			if (!options.limit) {
				options.limit = 30;
			}

			if (!options.offset) {
				options.offset = 0;
			}

			return rep.any(sql.selectAll, options).then(postsDbTransformation);
		},
		selectById: (id) => rep.oneOrNone(sql.selectById, {id: id}).then(postsDbTransformation),
		selectByUserId: (userId, options) => {
			if (!options) {
				options = {};
			}

			if (!options.limit) {
				options.limit = 30;
			}

			if (!options.offset) {
				options.offset = 0;
			}

			options.user_id = userId;

			return rep.oneOrNone(sql.selectByUserId, options).then(postsDbTransformation);
		},
		countAll: () => rep.one(sql.countAll).then(result => result.count),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id),
		publish: (id) => rep.none(sql.publish, {id: id})
	};
};
