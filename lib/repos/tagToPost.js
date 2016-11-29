const sql = require('../sql').tagToPost;

module.exports = (rep) => {
	return {
		insert: (values) => rep.one(sql.insert, values),
		deleteOne: (postId, tagId) => rep.none(sql.deleteOne, {
			post_id: postId,
			tag_id: tagId
		}),
		deleteAllForPost: (postId) => rep.none(sql.deleteAllForPost, {post_id: postId})
	};
};
