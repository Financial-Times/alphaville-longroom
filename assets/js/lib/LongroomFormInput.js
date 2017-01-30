/* global tinymce */

const domUtils = require('./domUtils');
const randomString = require('./utils/randomString');
const assetsPath = require('../assets_path');
const fileUpload = require('./fileUpload');
const uploadFileTypes = require('./upload_file_types');

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
	const fileSizeLimit = config.fileSizeLimit;
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
					'advlist autolink lists link image charmap print preview anchor',
					'searchreplace visualblocks code',
					'insertdatetime table contextmenu'
				],
				toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | link image | blockquote',
				formats: {
					alignleft: {classes : 'lr-align-left'},
					aligncenter: {classes : 'lr-align-center'},
					alignright: {classes : 'lr-align-right'},
					alignjustify: {classes : 'lr-align-full'},
					underline: {inline : 'span', 'classes' : 'lr-text-underline', exact: true},
					strikethrough: {inline : 'span', 'classes' : 'lr-text-strikethrough'},
				},
				content_css: `${assetsPath}/build/tinymce_wysiwyg.css`,
				images_upload_url: 'postAcceptor.php',
				images_upload_base_path: '/some/basepath',
				images_upload_credentials: true,
				file_picker_types: 'image',
				image_title: false,
				image_description: false,
				image_size: false,
				automatic_uploads: false,
				file_picker_callback: function(cb) {
					const input = document.createElement('input');
					input.setAttribute('type', 'file');
					input.setAttribute('accept', 'image/*');

					// Note: In modern browsers input[type="file"] is functional without
					// even adding it to the DOM, but that might not be the case in some older
					// or quirky browsers like IE, so you might want to add it to the DOM
					// just in case, and visually hide it. And do not forget do remove it
					// once you do not need it anymore.

					input.onchange = function() {
						const file = this.files[0];

						let fileType = file.type;

						if (!fileType) {
							const ext = file.name.substr(file.name.lastIndexOf('.') + 1);

							fileType = uploadFileTypes.fileTypeByExtension[ext];
						}

						if (!fileType || uploadFileTypes.allowedImageTypes.indexOf(fileType) === -1) {
							showError("The selected image type is not allowed.");
							return;
						}

						if (file.size > fileSizeLimit) {
							showError("The selected image is too large.");
							return;
						}

						fileUpload.uploadImage({
							name: file.name,
							type: fileType,
							size: file.size,
							file: file
						}).then((data) => {
							cb(data.url, { title: file.name });
						}).catch(err => {
							if (err && err.responseText && typeof err.responseText === 'object' && err.responseText.error) {
								showError(err.responseText.error);
							} else {
								showError('Failed to upload the document. Please try again later.');
								console.log(err);
							}
						});
					};

					input.click();
				}
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
