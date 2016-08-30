const fetch = require('node-fetch');

function UserProfileApiError(message, code) {
	this.errMsg = message;
	this.errCode = code;
}

UserProfileApiError.prototype = new Error('sessionApi');

const profileApiUrl = process.env['USER_PROFILE_API_URL'];
const profileApiKey = process.env['USER_PROFILE_API_KEY'];

const getUserProfile = (uuid, accessToken) => {

	const options = {
		headers: {
			'X-Api-Key': profileApiKey,
			'Authorization': `Bearer ${accessToken}`
		}
	};

	const url = profileApiUrl + uuid;

	return fetch(url, options).then((res) => {
		if ( res.status !== 200 ) {
			throw new UserProfileApiError(res.statusText, res.status);
		}
		return res.json();
	});
};

module.exports = {
	getUserProfile
};
