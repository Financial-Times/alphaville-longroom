const isObjectInArray = require('../utils/isObjectInArray');
const _ = require('lodash');
const fileTypes = require('../utils/fileTypes');

module.exports = function (dbResults) {
	let singleResult = false;

	if (dbResults && !dbResults.length)	 {
		dbResults = [dbResults];
		singleResult = true;
	}

	const normalizedPosts = {};
	const postsArr = [];

	dbResults.forEach(post => {
		let currentPost;

		if (!normalizedPosts[post.id]) {
			normalizedPosts[post.id] = _.pick(post, ['id', 'title', 'summary', 'post_type', 'user_id', 'published', 'created_at', 'published_at']);
			normalizedPosts[post.id].tags = [];
			normalizedPosts[post.id].files = [];
		}

		currentPost = normalizedPosts[post.id];

		if (post.tag_name) {
			if (!isObjectInArray(currentPost.tags, {
					value: post.tag_id,
					key: 'id'
				})) {
				currentPost.tags.push({
					id: post.tag_id,
					name: post.tag_name,
					index: post.tag_index
				});
			}
		}

		if (post.file_name) {
			if (!isObjectInArray(currentPost.files, [
					{
						value: post.file_name,
						key: 'name'
					},
					{
						value: post.file_size,
						key: 'size'
					},
					{
						value: post.file_ext,
						key: 'ext'
					},
					{
						value: post.file_source,
						key: 'source'
					}
				])) {

				currentPost.files.push({
					name: post.file_name,
					size: post.file_size,
					ext: post.file_ext,
					source: post.file_source,
					iconName: fileTypes.icons[post.file_ext]
				});
			}
		}

		currentPost.comments = {
			enabled: true
		};

		currentPost.webUrl = '/content/' + currentPost.id;
	});

	Object.keys(normalizedPosts).forEach(key => {
		const post = normalizedPosts[key];
		post.tags.sort((a, b) => {
			if (a.index > b.index) {
				return 1;
			}

			if (a.index < b.index) {
				return -1;
			}

			return 0;
		});

		if (post.tags.length) {
			post.primaryTag = _.omit(post.tags[0], ['index']);
		}

		postsArr.unshift(post);
	});

	return singleResult ? postsArr[0] : postsArr;
};
