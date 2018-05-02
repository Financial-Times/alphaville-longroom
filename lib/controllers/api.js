const db = require('../services/db').db;
const moment = require('moment-timezone');
const crypto = require('../services/crypto');
const als = require('../services/als');
const mailer = require('../services/mailer');
const _ = require('lodash');


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


exports.deleteUser = (req, res, next) => {
	let { user_id } = req.query;
	console.log('processing ID', user_id);
	removeUser(user_id)
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
