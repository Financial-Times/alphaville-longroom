/* global tinymce */

const domUtils = require('./domUtils');
const randomString = require('./utils/randomString');

const pollForTinymce = function () {
	return new Promise(resolve => {
		const checkTinymce = function () {
			if (window.tinymce) {
				resolve();
				return;
			}

			setTimeout(checkTinymce, 100);
		};

		checkTinymce();
	});
};

function LongroomFormInput (config) {
	const self = this;

	const input = config.input;
	const label = config.label;
	const labelPlural = config.labelPlural;
	const required = typeof config.required === 'boolean' ? config.required : true;

	let formGroup = domUtils.getParents(input, '.o-forms-group');
	if (formGroup && formGroup.length) {
		formGroup = formGroup[0];
	}

	let errorEl;

	if (formGroup) {
		errorEl = formGroup.querySelector('.o-forms-errortext');
	}

	if (config.wysiwyg) {
		if (!input.id) {
			input.id = randomString();
		}

		pollForTinymce().then(() => {
			tinymce.init({
				selector: `#${input.id}`,
				height: 300,
				menubar: false,
				plugins: [
					'advlist autolink lists link charmap print preview anchor',
					'searchreplace visualblocks code',
					'insertdatetime table contextmenu paste'
				],
				toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link'
			});
		});
	}


	const showError = function (errMsg) {
		if (errorEl) {
			errorEl.innerHTML = errMsg;
		}

		if (formGroup) {
			formGroup.classList.add('o-forms--error');
		}
	};

	const clearError = function () {
		if (errorEl) {
			errorEl.innerHTML = '';
		}

		if (formGroup) {
			formGroup.classList.remove('o-forms--error');
		}
	};

	this.getValue = function () {
		if (config.wysiwyg) {
			return window.tinymce.get(input.id).getContent();
		} else {
			return input.value.trim();
		}
	};

	this.validate = function () {
		if (!required) {
			return true;
		}

		if (!self.getValue()) {
			if (label) {
				showError(`${label} ${labelPlural ? 'are' : 'is'} required.`);
			} else {
				showError("The field is required.");
			}
			return false;
		}

		clearError();
		return true;
	};

	this.handleValidation = function (validationMessage) {
		showError(validationMessage);
	};

	this.showError = showError;
	this.clearError = clearError;
}

module.exports = LongroomFormInput;
