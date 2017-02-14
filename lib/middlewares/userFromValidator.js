const form = require('express-form');
const field = form.field;

const textRegexp = /^[a-zA-Z0-9,.!-;&? ]*$/;

const messages = {
	required: 'Field is required',
	limit(size) {
		return `Field value can not exceed ${size} characters.`;
	}
};

module.exports = () => {
	return form(
		field('pseudonym').trim()
			.required('', messages.required),
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
