const fetch = require('node-fetch');
const form = require('express-form');
const field = form.field;

const messages = {
	required: 'Field is required',
	limit(size) {
		return `Field value can not exceed ${size} characters.`;
	}
};

const isUnique = (displayName) => {
	const url = `https://comments-api.ft.com/displayname/isavailable/${encodeURIComponent(displayName)}`;

	return fetch(url, { method: 'GET' })
		.then(response => response.json())
		.then(({available}) => {
			return available;
		});
};

const findInvalidCharacters = (displayName) => {
	/*
	 * Allowed Characters
	 * The below regex matches any character not in the allowed characters set
	 * All allowed characters are case insensitive
	 * Anything in the range A-Z or 0-9 is allowed
	 * Any of the below special characters are allowed
	 * !#$%'`()*+,-./:;=@[]^_{|}
	 * Spaces are allowed
	 */

	const matchInvalidCharacters = /[^0-9a-z!#$%'`()*+,\-.\/:;=@[\]\^_{}\|\s]/gi;
	const matchingCharacters = displayName
		.match(matchInvalidCharacters);
	const uniqueMatchingCharacters = matchingCharacters && matchingCharacters.length ?
		matchingCharacters
			.filter((character, position) => matchingCharacters.indexOf(character) === position) :
		[];

	return uniqueMatchingCharacters.length ?
		uniqueMatchingCharacters.join('') :
		false;
};

const validation = (displayName, source, callback) => {
	const invalidCharacters = findInvalidCharacters(displayName);

	if (typeof source.pseudonym === 'undefined') {
		// The users psedudonym was prepopulated as they already have a commenting account
		// In this case we don't pass the psedudonym in the form so no need to validate
		callback(null);
	} else if (!source.pseudonym.length) {
		// User has left the psedudonym field blank and it is required
		callback(new Error(messages.required));
	} else if (invalidCharacters) {
		callback(new Error(`The display name contains the following invalid characters: ${invalidCharacters}`));
	} else {
		isUnique(displayName)
				.then(isUnique => {
					if (!isUnique) {
						callback(new Error('Unfortunately that display name is already taken'));
					} else {
						callback(null);
					}
				});
	}
};

module.exports = () => {
	return form(
		field('pseudonym').trim()
			.custom(validation),
		field('location').trim()
			.required('', messages.required)
			.maxLength(100, messages.limit(100))
			.entityEncode(),
		field('description').trim()
			.required('', messages.required)
			.maxLength(300, messages.limit(300))
			.entityEncode(),
		field('summary').trim()
			.maxLength(300, messages.limit(300))
			.entityEncode()
	);
};
