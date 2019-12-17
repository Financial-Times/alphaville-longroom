const db = require('../services/db').db;
const als = require('../services/als');
const s3 = require('../services/s3');
const crypto = require('../services/crypto');


const removeUser = user_id => {
	return als.getLrLicence(user_id)
		.then(license => {
			if (license && license.id) {
				als.revoke(license.id);
			}
		})
		.then(() => db.user.deleteById(user_id))
		.then(() => db.userDetails.deleteById(user_id));
};

const removeContent = post => {
	console.log('deleting post', post.id);

	return Promise.all(post.files.map(file => {
		console.log('deleting file', file.name);
		return s3.deleteObject(file.name);
	}))
	.then(() => {
		return db.tx(transaction => {
			const queries = [
				transaction.tagToPost.deleteAllForPost(post.id),
				transaction.post.delete(post.id),
				...(post.files.map(file => transaction.file.delete(file.id)))
			];

			return transaction.batch(queries);
		}).catch(err => {
			err = err || new Error("Transaction failed");
			err.postId = post.id;

			throw err;
		});
	})
};


const removeAllContent = user_id => {
	return db.post.selectByUserId({
		user_id,
		published: true
	})
	.then(posts => {
		console.log(posts);
		return Promise.all(
			posts.map(post =>
				removeContent(post)
			)
		);
	})
	.then(() => {
		return db.post.selectByUserId({
			user_id,
			published: false
		});
	})
	.then(posts => {
		return Promise.all(
			posts.map(post =>
				removeContent(post)
			)
		);
	});
};


const displayNameExists = uuid => {
	return db.displayNames.selectById(uuid)
		.then((users) => {
			return users.length ? true : false;
		});
};

exports.deleteUser = (req, res, next) => {
	let { user_id } = req.query;
	console.log('processing ID', user_id);

	new Promise (resolve => {
			if (req.query.withContent === 'true') {
				resolve(removeAllContent(user_id));
			}

			resolve();
		})
	.then(() => removeUser(user_id))
	.then(() => {
		res.json({
			success: true
		});
	})
	.catch((err) => {
		console.log("Error while removing user", err);

		res.status(503).json({
			success: false,
			reason: err
		});
	});
};

exports.syncDisplayName = async (req, res, next) => {
	const { uuid } = req.params;
	const { displayName } = req.body;
	const userExitsInDisplayNameTable = await displayNameExists(uuid);

	if (userExitsInDisplayNameTable) {
		const encryptedDisplayName = crypto.encrypt(displayName)
		db.displayNames.updateDisplayName(uuid, encryptedDisplayName)
			.then((user) => {
				return res.sendStatus(200);
			})
			.catch(error => {
				console.log(error);
				return res.status(500);
			});
	} else {
		return res.sendStatus(404);
	}
};
