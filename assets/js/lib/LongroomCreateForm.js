const LongroomFileUpload = require('./LongroomFileUpload');
const LongroomFormInput = require('./LongroomFormInput');

function LongroomCreateForm (formEl, fileSizeLimit) {
	const postType = formEl.getAttribute('data-lr-post-type');

	const fileUploadContainers = [];
	const uploadContainer = formEl.querySelectorAll('.lr-forms__file-upload--container');

	const titleInput = new LongroomFormInput({
		input: formEl.querySelector('input[name="post-title"]'),
		label: formEl.querySelector('label[for="post-title"]'),
		required: true
	});

	const tagsInput = new LongroomFormInput({
		input: formEl.querySelector('input[name="post-tags"]'),
		label: formEl.querySelector('label[for="post-tags"]'),
		required: true
	});

	const summaryInput = new LongroomFormInput({
		input: formEl.querySelector('textarea[name="post-summary"]'),
		label: formEl.querySelector('label[for="post-summary"]'),
		required: postType === 'post' ? true : false
	});

	for (const uploadContainerItem of uploadContainer) {
		fileUploadContainers.push(new LongroomFileUpload({
			container: uploadContainerItem,
			elSelector: '.lr-forms__file-upload--group',
			addMoreEl: document.querySelector('.lr-forms__action-link'),
			inputNames: [
				'post-file-source',
				'post-file'
			],
			fileSizeLimit: fileSizeLimit,
			required: postType === 'document' ? true : false
		}));
	}

	const draftButton = formEl.querySelector('[name="post-draft"]');
	const publishButton = formEl.querySelector('[name="post-publish"]');


	const serializeForm = function () {
		let filesUploaded = [];

		fileUploadContainers.forEach((fileUploadContainer) => {
			filesUploaded = filesUploaded.concat(fileUploadContainer.getFiles());
		});

		return {
			title: titleInput.getValue(),
			tags: tagsInput.getValue(),
			summary: summaryInput.getValue(),
			filesUploaded: filesUploaded
		};
	};

	const validate = function () {
		let valid = true;
		fileUploadContainers.forEach((fileUploadContainer) => {
			valid = fileUploadContainer.validate() && valid;
		});

		valid = titleInput.validate() && valid;
		valid = tagsInput.validate() && valid;
		valid = summaryInput.validate() && valid;

		return valid;
	};

	const submitForm = function (publish) {
		const valid = validate();
		console.log('valid', valid);

		if (valid) {
			const formSerialized = serializeForm();
			formSerialized.postType = postType;

			console.log(formSerialized, publish);
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
}

module.exports = LongroomCreateForm;
