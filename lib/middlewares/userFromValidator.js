const form = require('express-form');
const field = form.field;

const textRegexp = /^[a-zA-Z0-9,.!-;&? ]*$/;

const messages = {
	required: 'field is required.',
	illegalChars: 'field accepts only alphanumeric values and punctuation.',
	limit(size) {
		return `field value can not exceed ${size} characters.`;
	}
};

module.exports = () => {
	return form(
		field('pseudonym').trim()
			.required('', messages.required),
		field('location').trim()
			.required('', messages.required)
			.is(textRegexp, messages.illegalChars)
			.maxLength(100, messages.limit(100)),
		field('description').trim()
			.required('', messages.required)
			.is(textRegexp, messages.illegalChars)
			.maxLength(300, messages.limit(300)),
		field('summary').trim()
			.is(textRegexp, messages.illegalChars)
			.maxLength(300, messages.limit(300))
	);
};
