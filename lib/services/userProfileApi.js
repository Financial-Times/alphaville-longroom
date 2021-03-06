const fetch = require('node-fetch');
const Timer = require('../utils/Timer');

const endTimer = function (timer) {
	const elapsedTime = timer.getElapsedTime();
	if (elapsedTime > 5000) {
		console.warn('userProfileApi.getUserProfile: service high response time', elapsedTime + 'ms');
	} else {
		console.info('userProfileApi.getUserProfile: service response time', elapsedTime + 'ms');
	}
};

function UserProfileApiError(message, code, response) {
	this.statusText = message;
	this.message = message;
	this.errMsg = message;

	this.code = code;
	this.errCode = code;
	this.status = code;

	this.response = response;
}

UserProfileApiError.prototype = new Error('userProfileApi');

const profileApiUrl = process.env['USER_PROFILE_API_URL'];
const profileApiKey = process.env['USER_PROFILE_API_KEY'];

const getUserProfile = (uuid, accessToken) => {
	const options = {
		headers: {
			'X-Api-Key': profileApiKey,
			'Authorization': `Bearer ${accessToken}`
		}
	};

	const url = profileApiUrl + uuid + '/profile/basic';
	const urlDemographics = profileApiUrl + uuid + '/profile/demographics';

	const timer = new Timer();

	const basicUserData = fetch(url, options).then((res) => {
		endTimer(timer);

		if (!res.ok) {
			throw new UserProfileApiError(res.statusText, res.status, res.response);
		}

		return res.json();
	});

	const userDemographics = fetch(urlDemographics, options).then((res) => {
		endTimer(timer);

		if (!res.ok) {
			throw new UserProfileApiError(res.statusText, res.status, res.response);
		}

		return res.json();
	});

	return Promise.all([basicUserData, userDemographics])
		.then(data => Object.assign({}, data[0], { demographics: data[1] }))
};

module.exports = {
	getUserProfile
};
