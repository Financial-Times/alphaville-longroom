/*global fetch*/
const Awesomplete = require('awesomplete');
const toAscii = require('./utils/to-ascii');

const domUtils = require('./domUtils');
const Delegate = require('dom-delegate');


const MIN_LENGTH = 2;
const DISPLAY_ITEMS = 999;
const MAX_LENGTH = 30;
const MAX_TAGS = 3;

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
		sort: (text, input) => {
			const countText = parseInt(text.label.match(/([0-9]+)\)$/), 10);
			const countInput = parseInt(input.label.match(/([0-9]+)\)$/), 10);

			return countText < countInput ? 1 : (countText > countInput ? -1 : 0);
		}
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

	const enableInput = function () {
		input.removeAttribute('disabled');
	};

	const disableInput = function () {
		input.setAttribute('disabled', 'disabled');
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

	if (getTagList().length >= MAX_TAGS) {
		disableInput();
	}


	const setSuggestions = function (suggestions) {
		awesomplete.list = suggestions;
		lastSuggestions = suggestions;
		input.parentNode.querySelector('.awesomplete ul').scrollTop = 0;
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
		if (text.length > MAX_LENGTH) {
			showError(`Tags cannot exceed ${MAX_LENGTH} characters.`);
		} else if (hasTag(text)) {
			showError('The selected tag is already in the list.');
		} else {
			listContainer.appendChild(domUtils.toDOM(`<li class="lr-forms__tags--tag"><span class="o-buttons">${text}</span></li>`));
			awesomplete.close();

			input.value = '';
			searchTerm = '';

			if (getTagList().length >= MAX_TAGS) {
				disableInput();
			}
		}
	};

	const handleType = function (evt) {
		if (evt.key === 'Enter') {
			evt.preventDefault();
			return;
		}

		const latestTerm = input.value.trim();

		if (searchTerm !== latestTerm || !latestTerm) {
			searchTerm = latestTerm;

			if (searchTerm.length > MAX_LENGTH) {
				showError(`Tags cannot exceed ${MAX_LENGTH} characters.`);
			} else {
				clearError();
			}

			if (searchTerm.length >= MIN_LENGTH) {
				getSuggestions(searchTerm);
			} else {
				setSuggestions([]);
				awesomplete.close();
			}
		}
	};

	const handleHighlight = function (evt) {
		const suggestionListContainer = input.parentNode.querySelector('.awesomplete ul');
		const highlighted = input.parentNode.querySelector('.awesomplete ul li[aria-selected=true]');
		const allItems = input.parentNode.querySelectorAll('.awesomplete ul li');

		if (highlighted) {
			let index = 0;
			for (let i = 0; i < allItems.length; i++) {
				if (allItems[i] === highlighted) {
					index = i;
					break;
				}
			}

			suggestionListContainer.scrollTop = (index - 2) * 23;
		}
	}

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

			return;
		}
	});
	input.addEventListener('awesomplete-selectcomplete', (evt) => {
		evt.preventDefault();

		handleSelect(evt.text.value);
	});
	input.addEventListener('focus', handleFocus);
	input.addEventListener('awesomplete-highlight', handleHighlight);

	const listDelegate = new Delegate(listContainer);
	listDelegate.on('click', '.lr-forms__tags--tag', (evt) => {
		if (evt.target) {
			listContainer.removeChild(evt.target.parentNode);
			clearError();

			if (getTagList().length < MAX_TAGS) {
				enableInput();
			}
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
		} else {
			const tags = getTagList();

			if (input.value.trim()) {
				tags.push(input.value.trim());
			}

			if (tags.length > MAX_TAGS) {
				showError(`Maximum number of ${MAX_TAGS} tags can be selected.`);
				return false;
			}

			let validation = null;
			tags.forEach(tag => {
				if (tag.length > MAX_LENGTH) {
					validation = `Tags cannot exceed ${MAX_LENGTH} characters.`;
				}
			});

			if (validation) {
				showError(validation);
				return false;
			}
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
