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
		join: sql('user/join.sql'),
		rejoin: sql('user/rejoin.sql'),
		getUsersByStatus: sql('user/getUsersByStatus.sql'),
		updateUserStatus: sql('user/updateUserStatus.sql'),
		selectSummary: sql('user/selectSummary.sql'),
		updateSummary: sql('user/updateSummary.sql'),
		updatePseudonymFlag: sql('user/updatePseudonymFlag.sql'),
		deleteById: sql('user/deleteById.sql')
	},
	userDetails: {
		add: sql('user_details/add.sql'),
		deleteById: sql('user_details/deleteById.sql')
	},
	file: {
		selectById: sql('file/selectById.sql'),
		selectByName: sql('file/selectByName.sql'),
		insert: sql('file/insert.sql'),
		delete: sql('file/delete.sql'),
		selectOutdatedOrphan: sql('file/selectOutdatedOrphan.sql'),
		addSource: sql('file/addSource.sql'),
		attachToPost: sql('file/attachToPost.sql')
	},
	tag: {
		insert: sql('tag/insert.sql'),
		delete: sql('tag/delete.sql'),
		selectByName: sql('tag/selectByName.sql'),
		selectById: sql('tag/selectById.sql'),
		selectSuggestion: sql('tag/selectSuggestion.sql')
	},
	post: {
		insert: sql('post/insert.sql'),
		update: sql('post/update.sql'),
		delete: sql('post/delete.sql'),
		publish: sql('post/publish.sql'),
		countAll: sql('post/countAll.sql'),
		countByTagId: sql('post/countByTagId.sql'),
		countByUserId: sql('post/countByUserId.sql'),
		countSearch: sql('post/countSearch.sql'),
		selectAll: sql('post/selectAll.sql'),
		selectById: sql('post/selectById.sql'),
		selectByUserId: sql('post/selectByUserId.sql'),
		selectByTagId: sql('post/selectByTagId.sql'),
		selectSearch: sql('post/selectSearch.sql')
	},
	tagToPost: {
		insert: sql('tagToPost/insert.sql'),
		deleteOne: sql('tagToPost/deleteOne.sql'),
		deleteAllForPost: sql('tagToPost/deleteAllForPost.sql'),
		updateIndex: sql('tagToPost/updateIndex.sql')
	},
	cleanupStatus: {
		update: sql('cleanupStatus/update.sql'),
		get: sql('cleanupStatus/get.sql')
	}
};
