const sql = require('../sql').post;
const postsDbTransformation = require('../dbNormalizers/posts');

module.exports = (rep) => {
	return {
		selectAll: () => rep.any(sql.selectAll).then(postsDbTransformation),
		selectById: (id) => rep.oneOrNone(sql.selectById, {id: id}).then(postsDbTransformation),
		selectByUserId: (userId) => rep.oneOrNone(sql.selectByUserId, {user_id: userId}).then(postsDbTransformation),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id),
		publish: (id) => rep.none(sql.publish, {id: id})
	};
};
