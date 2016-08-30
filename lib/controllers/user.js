const qs = require('querystring');
const request = require('request-promise');
const userProfileApi = require('../services/userProfileApi');
const db = require('../services/db').db;

const authUrl = process.env['AUTHORIZE_PATH'];
const authParams = {
	response_type: 'token',
	client_id: process.env['AUTHORIZE_CLIENT_ID']
};

function getUserProfile(uuid, accessToken) {
	return userProfileApi.getUserProfile(uuid, accessToken);
}

function addJoinRequest(userProfile, formData) {
	let {
		    id: user_id,
		    email,
		    title,
		    firstName: first_name,
		    lastName: last_name,
		    demographics: {
			    industry: {
				    description: industry
			    }
		    },
		    demographics: {
			    position: {
				    description: position
			    }
		    },
		    demographics: {
			    responsibility: {
				    description: responsibility
			    }
		    }
	    } = userProfile.user;

	let {
			location,
			description
	    } = formData;

	return db.user.join({
		user_id,
		email,
		title,
		first_name,
		last_name,
		industry,
		position,
		responsibility,
		location,
		description,
	});
}

function getAccessToken(sessionId) {
	const jar = request.jar();
	const cookie = request.cookie(`${process.env['FT_SECURE_COOKIE_NAME']}=${sessionId}`);
	jar.setCookie(cookie, authUrl, {http: false, secure: true});
	return request({
		uri: authUrl,
		qs: authParams,
		method: 'GET',
		resolveWithFullResponse: true,
		jar: jar
	}).then(authRes => {
		if (authRes.statusCode === 200) {
			const hashes = authRes.request.uri.href.split('#');
			/**
			 * {access_token: '', token_type: '', expires_in: ''}
			 * or
			 * {error: '', error_description: ''}
			 */
			const response = qs.parse(hashes[1]);
			if ('error' in response) {
				throw new Error(response.error_description);
			}
			return response;
		}
		throw new Error(authRes.statusText);
	});
}
const join = (req, res, next) => {
	const userUuid = req.userUuid || process.env['TEST_UUID'];
	const sessionId = req.cookies[process.env['FT_SECURE_COOKIE_NAME']] ||
		req.cookies[process.env['FT_COOKIE_NAME']];

	if (!sessionId) {
		return res.render('error', {message: 'Invalid session'});
	}

	db.user.find(userUuid)
		.then(user => {
			if(user) {
				throw new Error('There is already a pending request for this user');
			}
			return getAccessToken(sessionId);
		})
		.then(({access_token}) => {
			return getUserProfile(userUuid, access_token);
		})
		.then(userProfile => {
			return addJoinRequest(userProfile, req.body);
		})
		.then(dbRes => {
			console.log(dbRes);
			res.render('successJoin', {message: 'Thank you! Your request will be processed.'});
		})
		.catch(next);
};

module.exports = {
	join
};
