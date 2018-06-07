const LongroomCreateForm = require('./LongroomCreateForm');
const Tooltip = require('o-tooltip');



document.addEventListener('o.DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.longroom-create-post');
	const tooltips = document.querySelectorAll('.lr-tooltip');

	if (tooltips && tooltips.length) {
		tooltips.forEach(t => {
			new Tooltip(t);
		});
	}

	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];

			new LongroomCreateForm(form);
		}
	}
});
