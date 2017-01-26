/*global fetch*/
const Awesomplete = require('awesomplete');
const toAscii = require('./utils/to-ascii');

const domUtils = require('./domUtils');
const Delegate = require('dom-delegate');


const MIN_LENGTH = 2;
const DISPLAY_ITEMS = 15;

function TagAutocomplete (config) {
	const self = this;

	const label = config.label;
	const input = config.input;
	const listContainer = config.list;
	const labelPlural = config.labelPlural;
	const required = typeof config.required === 'boolean' ? config.required : true;
	const dataSourceUrl = config.dataSourceUrl;

	let searchTerm = '';
	let lastSuggestions = [];

	let formGroup = domUtils.getParents(input, '.o-forms-group');
	if (formGroup && formGroup.length) {
		formGroup = formGroup[0];
	}

	let errorEl;

	if (formGroup) {
		errorEl = formGroup.querySelector('.o-forms-errortext');
	}


	const awesomplete = new Awesomplete(input, {
		maxItems: DISPLAY_ITEMS,
		filter: function (text, input) {
			// eslint-disable-next-line
			return Awesomplete.FILTER_STARTSWITH(toAscii(text.label), toAscii(input));
		},
		item: function (text, input) {
			// eslint-disable-next-line
			return Awesomplete.ITEM(toAscii(text.label), toAscii(input));
		},
		sort: new Function()
	});


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

	const hasTag = function (tagName) {
		const listItems = listContainer.querySelectorAll('.lr-forms__tags--tag span');

		for (let i = 0; i < listItems.length; i++) {
			if (listItems[i].innerHTML === tagName) {
				return true;
			}
		}

		return false;
	};

	const getTagList = function () {
		const list = [];

		const listItems = listContainer.querySelectorAll('.lr-forms__tags--tag span');

		for (let i = 0; i < listItems.length; i++) {
			list.push(listItems[i].innerHTML);
		}

		return list;
	};


	const setSuggestions = function (suggestions) {
		awesomplete.list = suggestions;
		lastSuggestions = suggestions;
	};

	const getSuggestions = function (value) {
		return fetch(`${dataSourceUrl}?q=${encodeURIComponent(value)}`)
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}

				return response.json();
			})
			.then(suggestions => {
				setSuggestions(suggestions);
			});
	};

	const handleSelect = function (text) {
		if (!hasTag(text)) {
			listContainer.appendChild(domUtils.toDOM(`<li class="lr-forms__tags--tag"><span class="o-buttons">${text}</span></li>`));
			awesomplete.close();

			input.value = '';
			searchTerm = '';
		} else {
			showError('The selected tag is already in the list.');
		}
	};

	const handleType = function (evt) {
		if (evt.key === 'Enter') {
			evt.preventDefault();
			return;
		}

		const latestTerm = input.value.trim();

		if (searchTerm !== latestTerm || !latestTerm) {
			clearError();
			searchTerm = latestTerm;

			if (searchTerm.length >= MIN_LENGTH) {
				getSuggestions(searchTerm);
			} else {
				setSuggestions([]);
				awesomplete.close();
			}
		}
	};

	const handleFocus = function () {
		if (searchTerm.length >= MIN_LENGTH && lastSuggestions.length) {
			awesomplete.open();
		}
	};



	input.addEventListener('keyup', handleType);
	input.addEventListener('keydown', (evt) => {
		if (evt.key === ',') {
			evt.preventDefault();
			return;
		}

		if (evt.key === 'Enter') {
			evt.preventDefault();

			if (input.value.trim()) {
				clearError();
				handleSelect(input.value.trim());
			}
		}
	});
	input.addEventListener('awesomplete-selectcomplete', (evt) => {
		evt.preventDefault();

		handleSelect(evt.text.value);
	});
	input.addEventListener('focus', handleFocus);

	const listDelegate = new Delegate(listContainer);
	listDelegate.on('click', '.lr-forms__tags--tag', (evt) => {
		if (evt.target) {
			listContainer.removeChild(evt.target.parentNode);
		}

		evt.preventDefault();
	});


	this.getValue = function () {
		const list = getTagList();

		if (input.value.trim()) {
			list.push(input.value.trim());
		}

		if (!list.length) {
			return '';
		}

		return list.join(',');
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

module.exports = TagAutocomplete;
