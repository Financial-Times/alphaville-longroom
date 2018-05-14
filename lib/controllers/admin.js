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
	return als.getLrLicence(user_id)
		.then(licence => {
			if (!licence) {
				return als.create(user_id)
					.then(({id}) => als.allocate(id, user_id))
			}
		})
		.then(() => db.user.updateUserStatus(user_id, 'approved'))
		.then(() => db.userDetails.deleteById(user_id))
		.then(() => mailer.sendApproved(user_id));
};

const rejectUser = user_id => {
	return db.user.updateUserStatus(user_id, 'rejected')
		.then(db.userDetails.deleteById(user_id))
		.then(() => mailer.sendRejected(user_id));
};

const suspendUser = user_id => {
	return als.getLrLicence(user_id)
		.then(({id}) => als.suspend(id))
		.then(() => db.user.updateUserStatus(user_id, 'revoked'));
};

const reinstateUser = user_id => {
	return als.getLrLicence(user_id, 'suspended')
		.then(({id}) => als.reinstate(id))
		.then(() => db.user.updateUserStatus(user_id, 'approved'));
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
			res.setFlashMessage('success', 'Your action was performed successfully.');
			res.redirect('/longroom/admin');
		})
		.catch((err) => {
			let flashMessage = '';
			if (err.message !== 'emailServiceError') {
				flashMessage = 'Your action has failed. Please try again.';
				console.log("Error while accepting user", err);
			} else {
				flashMessage = 'User approved but the notification email could not be sent.';
			}

			res.setFlashMessage('error', flashMessage);
			res.redirect('/longroom/admin');
		});
};

const suspend = (req, res, next) => {
	let { user_id } = req.params;
	suspendUser(user_id)
		.then(() => {
			res.setFlashMessage('success', 'Your action was performed successfully.');
			res.redirect(`/longroom/author/${user_id}`);
		})
		.catch((err) => {
			console.log("Error while suspending user", err);

			res.setFlashMessage('error', 'Your action has failed. Please try again.');
			res.redirect(`/longroom/author/${user_id}`);
		});
};

const reinstate = (req, res, next) => {
	let { user_id } = req.params;
	reinstateUser(user_id)
		.then(() => {
			res.setFlashMessage('success', 'Your action was performed successfully.');
			res.redirect(`/longroom/author/${user_id}`);
		})
		.catch((err) => {
			console.log("Error while reinstating user", err);

			res.setFlashMessage('error', 'Your action has failed. Please try again.');
			res.redirect(`/longroom/author/${user_id}`);
		});
};

const reject = (req, res, next) => {
	let { user_id } = req.params;
	rejectUser(user_id)
		.then(() => {
			res.setFlashMessage('success', 'Your action was performed successfully.');
			res.redirect('/longroom/admin');
		})
		.catch((err) => {
			let flashMessage = '';
			if (err.message !== 'emailServiceError') {
				flashMessage = 'Your action has failed. Please try again.';
				console.log("Error while accepting user", err);
			} else {
				flashMessage = 'User approved but the notification email could not be sent.';
			}

			res.setFlashMessage('error', flashMessage);
			res.redirect('/longroom/admin');
		});
};

module.exports = {
	index,
	approve,
	reject,
	suspend,
	reinstate
};
