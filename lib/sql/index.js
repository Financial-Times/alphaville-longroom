const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

const sql = (file) => {
	const fullPath = path.join(__dirname, file);
	const options = {
		minify: true
	};
	return new QueryFile(fullPath, options);
};

module.exports = {
	user: {
		join: sql('user/join.sql')
	},
	file: {
		selectById: sql('file/selectById.sql'),
		insert: sql('file/insert.sql'),
		delete: sql('file/delete.sql'),
		addSource: sql('file/addSource.sql'),
		attachToPost: sql('file/attachToPost.sql')
	},
	tag: {
		insert: sql('tag/insert.sql'),
		delete: sql('tag/delete.sql'),
		selectByName: sql('tag/selectByName')
	},
	post: {
		insert: sql('post/insert.sql'),
		delete: sql('post/delete.sql'),
		publish: sql('post/publish.sql'),
		selectAll: sql('post/selectAll.sql'),
		selectById: sql('post/selectById.sql'),
		selectByUserId: sql('post/selectByUserId.sql')
	},
	tagToPost: {
		insert: sql('tagToPost/insert'),
		deleteOne: sql('tagToPost/deleteOne'),
		deleteAllForPost: sql('tagToPost/deleteAllForPost'),
	}
};
