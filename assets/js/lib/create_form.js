const httpRequest = require('./httpRequest');
const domUtils = require('./domUtils');
const uploadFileTypes = require('./upload_file_types');


const getFileId = (file) => {
	return file.name.replace(/\W/g, '_').toLowerCase() + file.size + file.type.replace(/\W/g, '_').toLowerCase();
};


function LongroomFileUpload (uploadContainer, id, el) {
	const uploadButton = el.querySelector('.lr-forms__file-upload');
	const fileInput = el.querySelector('input[type="file"]');
	const fileSource = el.querySelector('.lr-forms__file-upload-source');
	const previewArea = el.querySelector('.lr-forms__file-upload-preview');
	const fileUploadError = el.querySelector('.lr-forms__file-upload-error');

	let fileToUpload = null;

	uploadButton.addEventListener('click', () => {
		fileInput.click();
	});

	const onTypeSourceInput = () => {
		if (fileSource.value !== "") {
			uploadButton.removeAttribute('disabled');
		} else {
			uploadButton.setAttribute('disabled', 'disabled');
		}
	};

	fileSource.addEventListener('keyup', onTypeSourceInput);
	fileSource.addEventListener('keydown', onTypeSourceInput);

	fileInput.addEventListener('change', () => {
		const file = fileInput.files[0];

		if (uploadFileTypes.allowedFileTypes.indexOf(file.type) === -1) {
			fileUploadError.innerHTML = "File " + file.name + " has a not allowed file type.";
			return;
		}

		if (uploadContainer.fileExists(file)) {
			fileUploadError.innerHTML = "File " + file.name + " has already been uploaded.";
			return;
		}

		uploadContainer.fileUploaded(id, file);
		fileToUpload = file;

		previewArea.innerHTML = file.name;
		uploadButton.setAttribute('disabled', 'disabled');
		fileUploadError.innerHTML = "";
	});

	this.getFile = function () {
		return fileToUpload;
	};
}

function LongroomFileUploadContainer (config) {
	const container = config.container;
	const elSelector = config.elSelector;
	const addMoreEl = config.addMoreEl;
	const actionButton = config.addMoreEl.querySelector('button');
	const inputNames = config.inputNames;
	const self = this;

	const fileUploadForms = {};

	let maxFiles = addMoreEl.getAttribute('data-maximum-files');
	if (!isNaN(maxFiles)) {
		maxFiles = parseInt(maxFiles, 10);
	} else {
		maxFiles = 1;
	}

	let index = 1;

	const uploadForms = container.querySelectorAll(elSelector);
	for (const uploadForm of uploadForms) {
		fileUploadForms[index] = new LongroomFileUpload(self, index, uploadForm);
		index++;
	}

	const template = container.querySelector(elSelector).outerHTML;


	if (Object.keys(fileUploadForms).length < maxFiles) {
		actionButton.addEventListener('click', onMoreUploadField);
	} else {
		actionButton.setAttribute('disabled', 'disabled');
	}


	function onMoreUploadField () {
		if (Object.keys(fileUploadForms).length < maxFiles) {
			let currentTemplate = template;
			inputNames.forEach((inputName) => {
				currentTemplate = currentTemplate.replace(`${inputName}1`, `${inputName}${index}`);
			});

			container.appendChild(domUtils.toDOM(template));
			const fileUploadFormElements = container.querySelectorAll(elSelector);
			fileUploadForms[index] = new LongroomFileUpload(self, index, fileUploadFormElements[fileUploadFormElements.length - 1]);
			actionButton.setAttribute('disabled', 'disabled');

			index++;
		}
	}


	this.fileExists = function (file) {
		let found = false;

		Object.keys(fileUploadForms).forEach((id) => {
			const uploadedFile = fileUploadForms[id].getFile();
			if (uploadedFile) {
				let match = true;

				['name', 'size', 'type'].forEach((key) => {
					if (uploadedFile[key] !== file[key]) {
						match = false;
					}
				});

				if (match) {
					found = true;
				}
			}
		});

		return found;
	};

	this.fileUploaded = function (id) {
		if (id === index - 1) {
			actionButton.removeAttribute('disabled', 'disabled');
		}
	};
}



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

document.addEventListener('o.DOMContentLoaded', () => {
	const forms = document.querySelectorAll('.longroom-create-post');
	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];

			const fileUploadContainers = [];
			const uploadContainer = form.querySelectorAll('.lr-forms__file-upload-container');

			for (const uploadContainerItem of uploadContainer) {
				fileUploadContainers.push(new LongroomFileUploadContainer({
					container: uploadContainerItem,
					elSelector: '.lr-forms__file-upload-group',
					addMoreEl: document.querySelector('.lr-forms__action-link'),
					inputNames: [
						'post-file-source',
						'post-file'
					]
				}));
			}

			form.addEventListener('submit', (e) => {
				e.preventDefault();
			});
		}
	}
});


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
