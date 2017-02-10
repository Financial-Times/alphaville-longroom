const sqlUser = require('../sql').user;
const sqlUserDetails = require('../sql').userDetails;

module.exports = (rep) => {
	return {
		join: (values, details) => {
			return rep.tx(t => {
				const q1 = t.one(sqlUser.join, values, user => user.user_id);
				const q2 = t.one(sqlUserDetails.add, details, user => user.user_id);
				return t.batch([q1, q2]);
			});
		},
		rejoin: (values, details) => {
			return rep.tx(t => {
				const q1 = t.any(sqlUser.rejoin, values).then(() => values.user_id);
				const q2 = t.one(sqlUserDetails.add, details, user => user.user_id);
				const q3 = t.any(sqlUser.updateUserStatus, {
					user_id: values.user_id,
					status: 'pending'
				}).then(() => values.user_id);
				return t.batch([q1, q2, q3]);
			});
		},
		find: (id) => rep.oneOrNone('SELECT * FROM users WHERE user_id = $1', id),
		getUsersByStatus: status => rep.any(sqlUser.getUsersByStatus, {status}),
		updateUserStatus: (user_id, status) => rep.any(sqlUser.updateUserStatus, {user_id, status}),
		selectSummary: userId => rep.any(sqlUser.selectSummary, {user_id:userId}),
		updateSummary: options => rep.any(sqlUser.updateSummary, options),
		updatePseudonymFlag: options => rep.any(sqlUser.updatePseudonymFlag, options)
	};
};
