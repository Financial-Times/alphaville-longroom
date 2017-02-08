const LongroomCreateForm = require('./LongroomCreateForm');



document.addEventListener('o.DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.longroom-create-post');
	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];

			new LongroomCreateForm(form);
		}
	}
});
