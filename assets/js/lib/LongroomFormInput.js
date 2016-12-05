const domUtils = require('./domUtils');

function LongroomFormInput (config) {
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
