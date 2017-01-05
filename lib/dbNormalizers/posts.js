const isObjectInArray = require('../utils/isObjectInArray');
const _ = require('lodash');
const fileTypes = require('../utils/fileTypes');
const sudsService = require('../services/suds');

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/London");

exports.flatten = function (dbResults) {
	let singleResult = false;

	if (dbResults && !dbResults.length)	 {
		dbResults = [dbResults];
		singleResult = true;
	}

	const normalizedPosts = {};
	const postsArr = [];

	dbResults.forEach(post => {
		if (!normalizedPosts[post.id]) {
			normalizedPosts[post.id] = _.pick(post, ['id', 'title', 'summary', 'post_type', 'user_id', 'user_summary', 'published', 'created_at', 'published_at']);
			normalizedPosts[post.id].tags = [];
			normalizedPosts[post.id].files = [];
		}

		const currentPost = normalizedPosts[post.id];

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
						value: post.file_id,
						key: 'id'
					},
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
					id: post.file_id,
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

exports.enrichWithPseudonyms = function (posts) {
	let singleResult = false;

	if (!posts.length) {
		singleResult = true;
		posts = [posts];
	}

	const userIds = [];
	posts.forEach(post => {
		if (userIds.indexOf(post.user_id) === -1) {
			userIds.push(post.user_id);
		}
	});

	return sudsService.getPseudonym(userIds).then(pseudonyms => {
		posts.forEach(post => {
			if (!post.user) {
				post.user = {};
			}

			if (pseudonyms[post.user_id]) {
				post.user.pseudonym = pseudonyms[post.user_id];
			} else {
				post.user.pseudonym = '-';
			}
		});

		return singleResult ? posts[0] : posts;
	});
};

exports.groupByTime = function (posts) {
	const timeCategories = [
		{
			label: 'Today',
			match: date => {
				const today = moment(new Date());
				date = moment(date);

				return (date.year() === today.year()
						&& date.dayOfYear() === today.dayOfYear());
			},
			date: new Date().toISOString(),
			items: []
		},
		{
			label: 'This week',
			match: date => {
				date = moment(date);
				const today = moment(new Date());
				const startOfWeek = moment().startOf('week').add(1, 'day');

				return (startOfWeek.isBefore(date) && today.isAfter(date));
			},
			items: []
		},
		{
			label: 'Last week',
			match: date => {
				date = moment(date);
				const startOfLastWeek = moment().startOf('week').subtract(6, 'day');
				const endOfLastWeek = moment().endOf('week').subtract(6, 'day');

				return (startOfLastWeek.isBefore(date) && endOfLastWeek.isAfter(date));
			},
			items: []
		},
		{
			label: 'This month',
			match: date => {
				date = moment(date);
				const startOfThisMonth = moment().startOf('month');
				const endOfThisMonth = moment().endOf('month');

				return (startOfThisMonth.isBefore(date) && endOfThisMonth.isAfter(date));
			},
			items: []
		},
		{
			label: 'Last month',
			match: date => {
				date = moment(date);
				const startOfLastMonth = moment().startOf('month').subtract(1, 'month');
				const endOfLastMonth = moment().endOf('month').subtract(1, 'month');

				return (startOfLastMonth.isBefore(date) && endOfLastMonth.isAfter(date));
			},
			items: []
		},
		{
			label: 'Older',
			match: () => {
				return true;
			},
			items: []
		}
	];

	let currentTimeCategory = 0;
	posts.forEach((post) => {
		while (!timeCategories[currentTimeCategory].match(new Date(post.published_at))) {
			currentTimeCategory++;
		}

		timeCategories[currentTimeCategory].items.push(post);
	});


	const results = [];
	let categoryIndex = 0;
	timeCategories.forEach((timeCategory) => {
		if (timeCategory.items.length) {
			categoryIndex++;
			const obj = _.pick(timeCategory, ['label', 'items', 'date']);

			results.push(obj);
		}
	});

	return results;
};
