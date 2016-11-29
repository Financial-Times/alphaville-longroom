const domUtils = require('./domUtils');

function LongroomFormInput (config) {
	const input = config.input;
	const label = config.label;
	const required = typeof config.required === 'boolean' ? config.required : true;

	let formGroup = domUtils.getParents(input, '.o-forms-group');
	if (formGroup && formGroup.length) {
		formGroup = formGroup[0];
	}

	let labelPlural = false;
	let labelText = null;


	if (label) {
		if (label.getAttribute('data-label-plural') === 'true') {
			labelPlural = true;
		}
		labelText = label.innerHTML;
	}

	let errorEl;

	if (formGroup) {
		errorEl = input.querySelector('.o-forms-errortext');
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
		return input.value;
	};

	this.validate = function () {
		if (!required) {
			return true;
		}

		if (!input.value) {
			if (labelText) {
				showError(`${labelText} ${labelPlural ? 'are' : 'is'} required.`);
			} else {
				showError("The field is required.");
			}
			return false;
		}

		clearError();
		return true;
	};
}

module.exports = LongroomFormInput;
