const crypto = require('./crypto');

const getByUserId = async (userId) => {
	// There is a circular dependency between these modules:
	// lib/services/db.js > lib/repos/post.js > lib/dbNormalizers/posts.js > lib/services/temporaryDisplayNameApi.js
	// That's why we import db module here.
	const db = require('./db').db;
	const user = await db.displayNames.selectById(userId);

	if (!user) {
		return;
	}

	return crypto.decrypt(user.display_name);
};

module.exports = { getByUserId };
