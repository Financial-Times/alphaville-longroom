const db = require('../services/db').db;
const moment = require('moment-timezone');
const crypto = require('../services/crypto');
const als = require('../services/als');
const mailer = require('../services/mailer');
const _ = require('lodash');

const decryptUser = user => {
	let userDetails = _.pick(user,
		['first_name', 'last_name', 'phone', 'email', 'industry', 'position', 'responsibility']
	);
	let decryptedUserDetails = _.mapValues(userDetails, d => d && crypto.decrypt(d));
	user = _.assign({}, user, {added_at: moment(user.added_at).format('MMMM Do')});
	return _.assign({}, user, decryptedUserDetails);
};

const approveUser = user_id => {
	return als.create(user_id)
		.then(({id}) => als.allocate(id, user_id))
		.then(() => mailer.sendApproved(user_id))
		.then(() => db.user.updateUserStatus(user_id, 'approved'))
		.then(() => db.userDetails.deleteById(user_id));
};

const rejectUser = user_id => {
	return db.user.updateUserStatus(user_id, 'rejected')
		.then(() => mailer.sendRejected(user_id))
		.then(db.userDetails.deleteById(user_id));
};

const index = (req, res, next) => {
	db.user.getUsersByStatus('pending')
		.map(decryptUser)
		.then(users => {
			res.render('admin', {users});
		})
		.catch(next);
};

const approve = (req, res) => {
	let { user_id } = req.params;
	approveUser(user_id)
		.then(() => {
			res.setFlashMessage('success', 'User accepted successfully.');
			res.redirect('/longroom/admin');
		})
		.catch((err) => {
			console.log("Error while accepting user", err);

			res.setFlashMessage('error', 'An error occurred while accepting the user.');
			res.redirect('/longroom/admin');
		});
};

const reject = (req, res) => {
	let { user_id } = req.params;
	rejectUser(user_id)
		.then(() => {
			res.setFlashMessage('success', 'User rejected successfully.');
			res.redirect('/longroom/admin');
		})
		.catch((err) => {
			console.log("Error while rejecting user", err);

			res.setFlashMessage('error', 'An error occurred while rejecting the user.');
			res.redirect('/longroom/admin');
		});
};

module.exports = {
	index,
	approve,
	reject
};
