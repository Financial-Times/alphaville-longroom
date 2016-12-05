const LongroomCreateForm = require('./LongroomCreateForm');

const fileSizeLimit = 100 * 1024 * 1024;



document.addEventListener('o.DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.longroom-create-post');
	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];

			new LongroomCreateForm(form, fileSizeLimit);
		}
	}
});
