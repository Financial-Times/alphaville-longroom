const domUtils = require('./domUtils');

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

/*function TagAutocomplete (config) {
	const container = config.container;
	const dataSourceUrl = config.dataSourceUrl;


	const input = container.querySelector('.lr-forms__tags--input');
	const tagList = container.querySelector('.lr-forms__tags--list');
	container.appendChild(domUtils.toDOM(
		`<select class="lr-forms__tags--autocomplete o-forms-select" multiple></select>`
	));
	const autocomplete = container.querySelector('.lr-forms__tags--autocomplete');

	const autocompleteDelegate = new Delegate(autocomplete);

	const tags = [];

	for (const tag of tagList.querySelectorAll('.lr-forms__tags--tag')) {
		tags.push(tag.querySelector('.lr-forms__tags--value').innerHTML);
	}


	const addTag = function (tag) {
		tags.push(tag);
		tagList.appendChild(domUtils.toDOM(
			`<li class="lr-forms__tags--tag">
				<span class="o-buttons lr-forms__tags--value">${tag}</span>
			</li>`
		));
	};



	const dataSource = [
		'option1',
		'option2',
		'option3'
	];

	const onTypeInput = function (evt) {
		let autocompleteOptions;

		switch (evt.key) {
			case ',':
			case 'Enter':
				addTag(input.value.replace(',', ''));
				input.value = '';
				autocomplete.style.display = 'none';
				break;

			case 'ArrowDown':
				autocompleteOptions = autocomplete.querySelectorAll('option');
				if (autocompleteOptions.length) {
					for (const autocompleteOption of autocompleteOptions) {
						autocompleteOption.selected = false;
					}

					autocompleteOptions[0].selected = true;
					autocomplete.focus();
				}
				break;

			case 'ArrowUp':
				autocompleteOptions = autocomplete.querySelectorAll('option');
				if (autocompleteOptions.length) {
					for (const autocompleteOption of autocompleteOptions) {
						autocompleteOption.selected = false;
					}

					autocompleteOptions[autocompleteOptions.length - 1].selected = true;
					autocomplete.focus();
				}
				break;

			default:
				if (input.value.length > 1) {
					autocomplete.style.display = 'block';
					autocomplete.innerHTML = '';
					dataSource.forEach(tag => {
						autocomplete.appendChild(domUtils.toDOM(
							`<option value="${tag}">${tag}</option>`
						));
					});
				} else {
					autocomplete.style.display = 'none';
				}
		}
	};
	input.addEventListener('change', onTypeInput);


	const onKeypressAutocomplete = function (evt) {
		console.log(evt);
	};
	autocomplete.addEventListener('select', onKeypressAutocomplete);

	autocompleteDelegate.on('click', 'option', function () {

	});


	this.getTags = function () {
		return tags;
	};
}*/


/*  */



function resetFormErrorStatus (form) {
	const formGroups = form.querySelectorAll('.o-forms-group');
	for (let j = 0; j < formGroups.length; j++) {
		formGroups[j].classList.remove('o-forms--error');
		const errorTextEl = formGroups[j].querySelector('.o-forms-errortext');
		if (errorTextEl) {
			errorTextEl.innerHTML = "";
		}
	}
}

function handleResponse (form, response) {
	resetFormErrorStatus(form);

	if (response.success) {
		document.location.href = '/longroom/discussion/' + response.id;
	} else {
		try {
			const keys = Object.keys(response.validation || {});
			keys.forEach((key) => {
				const inputEl = form.querySelector(`[name="${key}"]`);
				if (inputEl) {
					let formGroup = domUtils.getParents(inputEl, '.o-forms-group');
					if (formGroup && formGroup.length) {
						formGroup = formGroup[0];

						formGroup.classList.add('o-forms--error');
						let errorTextEl = formGroup.querySelector('.o-forms-errortext');
						if (!errorTextEl) {
							const div = document.createElement('div');
							div.classList.add('o-forms-errortext');
							formGroup.appendChild(div);
							errorTextEl = formGroup.querySelector('.o-forms-errortext');
						}

						errorTextEl.textContent = response.validation[key];
					}
				}
			});

			if (response.genericMessage) {
				form.querySelector('.lr-generic-message').textContent = response.genericMessage;
			}
		} catch (e) {
			form.querySelector('.lr-generic-message').textContent = "An error occured.";
		}
	}
}

function handleError (form, err) {
	resetFormErrorStatus(form);

	console.log('error', err);
}




	/*const forms = document.querySelectorAll('.longroom-create-post');
	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];
			const fileUploadsEl = form.querySelectorAll('.lr-file-upload');
			const fileUploads = [];

			if (fileUploadsEl && fileUploadsEl.length) {
				for (let i = 0; i < fileUploadsEl.length; i++) {
					fileUploads.push(new LongroomFileUpload(fileUploadsEl[i], {
						maxFiles: 5
					}));
				}
			}

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				if (LongroomFileUpload.isAdvancedUpload) {
					const formData = new FormData();
					const serializedForm = serializeForm(form);
					Object.keys(serializedForm).forEach((key) => {
						formData.append(key, serializedForm[key]);
					});

					fileUploads.forEach((fileUpload) => {
						fileUpload.files().forEach((file) => {
							formData.append(fileUpload.name(), file);
						});
					});

					httpRequest.post({
						url: form.action,
						body: formData
					}).then((data) => {
						handleResponse(form, JSON.parse(data));
					}).catch((err) => {
						handleError(form, err);
					});
				} else {
					const target = form.getAttribute('target');

					const iframeName = 'uploadiframe' + new Date().getTime();
					const iframe = document.createElement('iframe');
					iframe.name = iframeName;
					iframe.style.display = 'none';

					document.body.appendChild(iframe);

					form.setAttribute('target', iframeName);

					const hiddenInput = document.createElement('input');
					hiddenInput.type = 'hidden';
					hiddenInput.name = 'upload';
					hiddenInput.value = 'iframe';

					form.appendChild(hiddenInput);

					iframe.addEventListener('load', function() {
						const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
						const data = JSON.parse(iframeDocument.querySelector('body').textContent);

						handleResponse(form, JSON.stringify(data));

						iframe.parentNode.removeChild(iframe);
						form.setAttribute('target', target);
						form.removeChild(hiddenInput);
					});

					form.submit();
				}
			});
		}
	}
})*/


function serializeForm (form) {
	let field;
	const assocArray = {};
	let i;
	let j;

	if (typeof form === 'object' && form.nodeName === "FORM"){
		for (i = form.elements.length-1; i >= 0; i--){
			field = form.elements[i];
			if (field.name && field.type !== 'file' && field.type !== 'reset' && !field.hasAttribute('disabled')) {
				if (field.type === 'select-multiple'){
					for (j = form.elements[i].options.length-1; j >= 0; j--) {
						if (field.options[j].selected) {
							assocArray[field.name] = field.options[j].value;
						}
					}
				} else {
					if ((field.type !== 'submit' && field.type !== 'button')) {
						if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
							assocArray[field.name] = field.value;
						}
					}
				}
			}
		}
	}

	return assocArray;
};
