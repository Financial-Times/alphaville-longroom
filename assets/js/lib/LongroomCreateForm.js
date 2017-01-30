const LongroomFileUpload = require('./LongroomFileUpload');
const LongroomFormInput = require('./LongroomFormInput');
const TagAutocomplete = require('./TagAutocomplete');
const httpRequest = require('./httpRequest');

function LongroomCreateForm (formEl, fileSizeLimit) {
	const postType = formEl.getAttribute('data-lr-post-type');

	const genericErrorMsgEl = formEl.querySelector('.lr-generic-message');

	let fileUploadContainer = null;
	const uploadContainer = formEl.querySelector('.lr-forms__file-upload--container');

	const titleInput = new LongroomFormInput({
		input: formEl.querySelector('input[name="post-title"]'),
		label: 'Title',
		required: true
	});

	const tagsInput = new TagAutocomplete({
		input: formEl.querySelector('input[name="post-tags"]'),
		list: formEl.querySelector('.lr-forms__tags--list'),
		dataSourceUrl: '/longroom/suggestions/tags',
		label: 'Topic tags',
		labelPlural: true,
		required: true
	});

	const summaryInput = new LongroomFormInput({
		input: formEl.querySelector('textarea[name="post-summary"]'),
		label: 'Summary',
		required: postType === 'post' ? true : false,
		wysiwyg: true,
		fileSizeLimit: fileSizeLimit
	});

	if (uploadContainer) {
		fileUploadContainer = new LongroomFileUpload({
			container: uploadContainer,
			elSelector: '.lr-forms__file-upload--group',
			templateSelector: '.lr-forms__file-upload--group--template',
			addMoreEl: document.querySelector('.lr-forms__action-link'),
			inputNames: [
				'post-file-source',
				'post-file'
			],
			fileSizeLimit: fileSizeLimit,
			required: postType === 'document' ? true : false
		});
	}

	const draftButton = formEl.querySelector('[name="post-draft"]');
	const publishButton = formEl.querySelector('[name="post-publish"]');


	const serializeForm = function () {
		let filesUploaded = [];

		filesUploaded = fileUploadContainer.getFiles();

		return {
			title: titleInput.getValue(),
			tags: tagsInput.getValue(),
			summary: summaryInput.getValue(),
			files: filesUploaded
		};
	};

	const validate = function () {
		let valid = true;

		valid = fileUploadContainer.validate() && valid;
		valid = titleInput.validate() && valid;
		valid = tagsInput.validate() && valid;
		valid = summaryInput.validate() && valid;

		return valid;
	};

	const resetValidationErrors = function () {
		titleInput.clearError();
		tagsInput.clearError();
		summaryInput.clearError();
		fileUploadContainer.clearErrors();
		genericErrorMsgEl.innerHTML = "";
	};

	let safeRedirect = false;
	const submitForm = function (publish) {
		resetValidationErrors();

		const valid = validate();

		if (valid) {
			const formSerialized = serializeForm();
			formSerialized.postType = postType;
			formSerialized.publish = publish;

			if (draftButton) {
				draftButton.setAttribute('disabled', 'disabled');
			}

			if (publishButton) {
				publishButton.setAttribute('disabled', 'disabled');
			}

			httpRequest.post({
				url: formEl.getAttribute('action'),
				dataType: 'json',
				contentType: 'application/json',
				body: JSON.stringify(formSerialized)
			}).then(data => {
				if (data.success) {
					safeRedirect = true;

					window.location.href = data.url;
				} else {
					if (draftButton) {
						draftButton.removeAttribute('disabled');
					}

					if (publishButton) {
						publishButton.removeAttribute('disabled');
					}

					if (data.validation) {
						if (data.validation.title) {
							titleInput.handleValidation(data.validation.title);
						}

						if (data.validation.tags) {
							tagsInput.handleValidation(data.validation.tags);
						}

						if (data.validation.summary) {
							summaryInput.handleValidation(data.validation.summary);
						}

						if (data.validation.files) {
							fileUploadContainer.handleValidation(data.validation.files);
						}
					}

					if (data.genericMessage) {
						genericErrorMsgEl.innerHTML = data.genericMessage;
					}
				}
			}).catch(err => {
				console.log(err);
				alert("Save failed. Please try again later.");
			});
		}
	};

	formEl.addEventListener('submit', (evt) => {
		evt.preventDefault();
	});

	if (draftButton) {
		draftButton.addEventListener('click', evt => {
			evt.preventDefault();

			submitForm(false);
		});
	}

	if (publishButton) {
		publishButton.addEventListener('click', evt => {
			evt.preventDefault();

			submitForm(true);
		});
	}

	window.onbeforeunload = function(e) {
		const formValues = serializeForm();
		if (!safeRedirect &&
				(formValues.title || formValues.tags || formValues.summary || formValues.files.length)) {
			const dialogText = 'Changes you made may not be saved.';
			e.returnValue = dialogText;
			return dialogText;
		}
	};
}

module.exports = LongroomCreateForm;
