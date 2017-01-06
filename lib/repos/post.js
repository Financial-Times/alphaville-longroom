const sql = require('../sql').post;
const postsDbTransformation = require('../dbNormalizers/posts');
const _ = require('lodash');

const defaultOptions = {
	limit:30, 
	offset:0, 
	published:true,
	orderBy : 'published_at'
}

module.exports = (rep) => {
	return {
		selectAll: (options = {}) => {
			return rep.any(sql.selectAll, _.defaults({}, options, defaultOptions))
				.then(postsDbTransformation.flatten)
				.then(postsDbTransformation.enrichWithPseudonyms);
		},
		selectById: (id) => rep.any(sql.selectById, {id: id})
				.then(postsDbTransformation.flatten)
				.then(postsDbTransformation.enrichWithPseudonyms),
		selectByUserId: (options = {}) => {
			if (options.published === false) {
				options.orderBy = 'created_at';
			}
			return rep.any(sql.selectByUserId, _.defaults({}, options, defaultOptions))
				.then(postsDbTransformation.flatten)
				.then(postsDbTransformation.enrichWithPseudonyms);
		},
		selectByTagId: (options = {}) => {
			return rep.any(sql.selectByTagId, _.defaults({}, options, defaultOptions))
				.then(postsDbTransformation.flatten)
				.then(postsDbTransformation.enrichWithPseudonyms);
		},
		countAll: () => rep.one(sql.countAll).then(result => result.count),
		countByTagId: (tagId) => rep.one(sql.countByTagId, {tag_id:tagId}).then(result => result.count),
		countByUserId: (options = {}) => rep.one(sql.countByUserId, _.defaults({}, options, defaultOptions)).then(result => result.count),
		delete: (id) => rep.none(sql.delete, {id: id}),
		insert: (values) => rep.one(sql.insert, values, result => result.id),
		publish: (id) => rep.none(sql.publish, {id: id}),
		update: (id, values) => rep.one(sql.update, Object.assign({}, {id}, values), result => result.id)
	};
};
