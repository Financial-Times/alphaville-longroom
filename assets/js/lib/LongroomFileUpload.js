const httpRequest = require('./httpRequest');
const uploadFileTypes = require('./upload_file_types');
const domUtils = require('./domUtils');
const assetsPath = require('../assets_path');


function getSignedRequest (file) {
	return httpRequest.get({
		url: '/longroom/files/sign',
		dataType: 'json',
		query: {
			'file-name': file.name,
			'file-type': file.type,
			'file-size': file.size
		}
	}).then((data) => {
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}

		if (data) {
			return data;
		} else {
			throw new Error("Failed to fetch signed request.");
		}
	});
}

function uploadFile (file, onProgress) {
	return getSignedRequest(file)
		.then(data => {
			return httpRequest.put({
				url: data.signedRequest,
				body: file,
				dataType: 'json',
				withCredentials: false,
				onProgress: onProgress
			}).then(() => {
				return {
					url: data.url,
					id: data.fileId,
					savedName: data.savedFileName
				};
			});
		}
	);
}

function deleteFile (fileId) {
	return httpRequest.post({
		url: '/longroom/files/delete',
		dataType: 'json',
		body: {
			'file-id': fileId
		}
	});
}

function LongroomFileUpload (config) {
	const self = this;

	const container = config.container;
	const elSelector = config.elSelector;
	const addMoreEl = config.addMoreEl;
	const addMoreButton = config.addMoreEl.querySelector('button');
	const inputNames = config.inputNames;
	const fileSizeLimit = config.fileSizeLimit;
	const required = typeof config.required === 'boolean' ? config.required : true;

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
		fileUploadForms[index] = new LongroomFileUploadItem({
			uploadContainer: self,
			id: index,
			el: uploadForm,
			fileSizeLimit: fileSizeLimit
		});
		index++;
	}

	const disableAddMoreButton = function () {
		addMoreButton.setAttribute('disabled', 'disabled');
	};

	const enableAddMoreButton = function () {
		addMoreButton.removeAttribute('disabled');
	};

	const hasLastUploadFormFileUploaded = function () {
		const uploadFormKeys = Object.keys(fileUploadForms);
		const lastUploadForm = fileUploadForms[uploadFormKeys[uploadFormKeys.length - 1]];

		return !!lastUploadForm.getContent().file;
	};

	const isUploadFormsWithinMax = function () {
		return Object.keys(fileUploadForms).length < maxFiles;
	};


	const template = container.querySelector(elSelector).outerHTML;

	const addMoreUploadField = function (evt) {
		if (evt && typeof evt.preventDefault === 'function') {
			evt.preventDefault();
		}

		if (isUploadFormsWithinMax()) {
			let currentTemplate = template;
			inputNames.forEach((inputName) => {
				currentTemplate = currentTemplate.replace(`${inputName}1`, `${inputName}${index}`);
			});

			container.appendChild(domUtils.toDOM(template));
			const fileUploadFormElements = container.querySelectorAll(elSelector);
			fileUploadForms[index] = new LongroomFileUploadItem({
				uploadContainer: self,
				id: index,
				el: fileUploadFormElements[fileUploadFormElements.length - 1],
				fileSizeLimit: fileSizeLimit
			});
			disableAddMoreButton();

			index++;
		}
	};


	if (isUploadFormsWithinMax()) {
		addMoreButton.addEventListener('click', addMoreUploadField);
	} else {
		disableAddMoreButton();
	}





	this.fileExists = function (file) {
		let found = false;

		Object.keys(fileUploadForms).forEach((id) => {
			const uploadedFile = fileUploadForms[id].getContent().file;
			if (uploadedFile && uploadedFile.fileObj) {
				let match = true;

				['name', 'size', 'type'].forEach((key) => {
					if (uploadedFile.fileObj[key] !== file[key]) {
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
		if (id === index - 1 && isUploadFormsWithinMax()) {
			enableAddMoreButton();
		}
	};

	this.removeUploadForm = function (id) {
		delete fileUploadForms[id];

		if (!Object.keys(fileUploadForms).length) {
			addMoreUploadField();
		} else if (isUploadFormsWithinMax() && hasLastUploadFormFileUploaded()) {
			enableAddMoreButton();
		}
	};


	this.getFiles = function () {
		const files = [];

		Object.keys(fileUploadForms).forEach((id) => {
			const fileUploadForm = fileUploadForms[id];
			const fileInfo = fileUploadForm.getContent();

			if (fileInfo && fileInfo.file) {
				files.push({
					fileId: fileInfo.file.id,
					source: fileInfo.source,
					fileStatus: fileInfo.status,
					fileUploadFormElId: id
				});
			}
		});

		return files;
	};


	this.clearErrors = function () {
		Object.keys(fileUploadForms).forEach((id) => {
			const fileUploadForm = fileUploadForms[id];
			fileUploadForm.clearError();
		});
	};

	this.showErrors = function (errMsg, markField) {
		Object.keys(fileUploadForms).forEach((id) => {
			const fileUploadForm = fileUploadForms[id];
			fileUploadForm.showError(errMsg, markField);
		});
	};

	this.validate = function () {
		self.clearErrors();

		let valid = true;

		Object.keys(fileUploadForms).forEach((id) => {
			const fileUploadForm = fileUploadForms[id];
			const itemValid = fileUploadForm.validate();

			if (!itemValid) {
				valid = false;
			}
		});

		if (required && !self.getFiles().length) {
			self.showErrors("It is mandatory to upload at least one document.", true);
		}

		return valid;
	};

	this.handleValidation = function (validation) {
		if (typeof validation === 'string') {
			self.showErrors(validation, true);
		} else {
			const validationIds = Object.keys(validation);
			if (validationIds.length) {
				validationIds.forEach(id => {
					if (fileUploadForms[id]) {
						fileUploadForms[id].showError(validation[id]);
					}
				});
			}
		}
	};
}

function LongroomFileUploadItem (config) {
	const self = this;

	let content = {
		status: 'new',
		file: null
	};

	const uploadContainer = config.uploadContainer;
	const id = config.id;
	const el = config.el;
	const fileSizeLimit = config.fileSizeLimit;

	let uploadButton;
	let fileInput;

	let existingFile = false;
	const fileId = el.getAttribute('data-file-id');
	if (fileId && !isNaN(fileId)) {
		existingFile = true;
		content.status = 'existing';
		content.file = {
			id: parseInt(fileId, 10)
		};
	}

	if (!existingFile) {
		uploadButton = el.querySelector('.lr-forms__file-upload');
		fileInput = el.querySelector('input[type="file"]');

		uploadButton.addEventListener('click', (evt) => {
			evt.preventDefault();

			fileInput.click();
		});
	}

	const fileSource = el.querySelector('.lr-forms__file-upload--source');
	const previewArea = el.querySelector('.lr-forms__file-upload--preview');
	const fileUploadError = el.querySelector('.lr-forms__file-upload--error');

	let formGroup = domUtils.getParents(el, '.o-forms-group');
	if (formGroup && formGroup.length) {
		formGroup = formGroup[0];
	}


	const attachPreviewAreaEvents = function () {
		previewArea.querySelector('.lr-forms__file-upload--delete').addEventListener('click', (evt) => {
			evt.preventDefault();

			if (!existingFile) {
				el.parentNode.removeChild(el);
				deleteFile(content.file.id);
				uploadContainer.removeUploadForm(id);
			} else {
				content.status = 'remove';

				el.parentNode.removeChild(el);
			}
		});
	};


	const disableUploadButton = function () {
		uploadButton.setAttribute('disabled', 'disabled');
	};

	const enableUploadButton = function () {
		uploadButton.removeAttribute('disabled');
	};

	const showError = function (error, markField) {
		fileUploadError.innerHTML = error;

		if (markField && formGroup) {
			formGroup.classList.add('o-forms--error');
		}
	};

	const clearError = function () {
		fileUploadError.innerHTML = '';

		if (formGroup) {
			formGroup.classList.remove('o-forms--error');
		}
	};

	const startProgress = function () {
		previewArea.innerHTML = '<progress class="lr-forms__file-upload--progress" max="1" value="0"></progress>';
	};

	const endProgress = function () {
		previewArea.innerHTML = '';
	};

	const onProgress = function (percentage) {
		const progress = previewArea.querySelector('progress');
		if (progress) {
			progress.value = percentage;
		}
	};

	const onTypeSourceInput = function () {
		if (fileSource.value.trim() !== "" && (!fileInput.files || !fileInput.files.length)) {
			enableUploadButton();
		} else {
			disableUploadButton();
		}
	};

	const clearFileInput = function () {
		fileInput.files = null;
		fileInput.value = null;
	};


	if (existingFile) {
		attachPreviewAreaEvents();
	} else {
		fileSource.addEventListener('keyup', onTypeSourceInput);
		fileSource.addEventListener('keydown', onTypeSourceInput);

		fileInput.addEventListener('change', () => {
			clearError();
			disableUploadButton();
			startProgress();

			const file = fileInput.files[0];

			if (uploadFileTypes.allowedFileTypes.indexOf(file.type) === -1) {
				showError("The selected document type is not allowed.");

				clearFileInput();
				endProgress();
				enableUploadButton();

				return;
			}

			if (uploadContainer.fileExists(file)) {
				showError("The selected document is already uploaded.");

				clearFileInput();
				endProgress();
				enableUploadButton();

				return;
			}

			if (file.size > fileSizeLimit) {
				showError("The selected document is too large.");

				clearFileInput();
				endProgress();
				enableUploadButton();

				return;
			}


			uploadFile(file, onProgress).then((result) => {
				endProgress();

				uploadContainer.fileUploaded(id, file);
				content.file = {
					id: result.id,
					fileObj: file,
					savedName: result.savedName
				};

				previewArea.innerHTML = `
					<img src="${assetsPath}/images/file_extension_icons/${uploadFileTypes.fileTypesIcons[file.type]}.png" />
					<span class="lr-forms__file-upload--preview-info">
						${file.name}<br/>
						<a class="lr-forms__file-upload--delete">Delete</a>
					</span>
				`;

				attachPreviewAreaEvents();
			})
			.catch(() => {
				fileInput.files = null;
				showError('Failed to upload the document. Please try again later.');

				clearFileInput();
				endProgress();
				enableUploadButton();
			});
		});
	}


	this.getContent = function () {
		return Object.assign({}, content, {
			source: fileSource.value
		});
	};

	this.validate = function () {
		if (content.status !== 'remove') {
			if (content.status === 'new' && fileSource.value && !content.file) {
				showError("Please upload a file.");
				return false;
			}

			if (content.file && !fileSource.value) {
				showError("Document source is required.", true);
				return false;
			}
		}

		clearError();
		return true;
	};
	this.showError = showError;
	this.clearError = clearError;
}

module.exports = LongroomFileUpload;
