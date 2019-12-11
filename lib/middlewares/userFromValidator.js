const form = require('express-form');
const field = form.field;

const messages = {
	required: 'Field is required',
	limit(size) {
		return `Field value can not exceed ${size} characters.`;
	}
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

const validation = (displayName) => {
	const invalidCharacters = findInvalidCharacters(displayName);

	if (invalidCharacters) {
		throw new Error(`The display name contains the following invalid characters: ${invalidCharacters}`);
	}
};

module.exports = () => {
	return form(
		field('pseudonym').trim()
			.required('', messages.required)
			.custom(displayName => validation(displayName)),
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
