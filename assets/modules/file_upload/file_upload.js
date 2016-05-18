const Delegate = require('dom-delegate');
const hogan = require('hogan');
const domUtils = require('../domUtils');

function LongroomFileUpload (el, config) {
	config = config || {};

	const lrAlert = config.alert || window.alert;
	const maxFiles = config.maxFiles || Infinity;

	el.classList.add('lr-upload');

	const input = el.querySelector('input[type="file"]');

	const filesToUpload = [];

	if (isAdvancedUpload) {
		el.classList.add('draganddrop');

		el.appendChild(domUtils.toDOM(hogan.compile(requireText('./file_upload_advanced.html')).render()));

		const dropzoneEl = el.querySelector('.lr-upload-dropzone');
		const previewEl = el.querySelector('.lr-upload-preview');
		const previewHintEl = el.querySelector('.lr-upload-preview-msg');

		const previewDelegate = new Delegate(previewEl);
		previewDelegate.on('click', 'li', function (evt) {
			let liEl = domUtils.getParents(evt.srcElement, 'li');
			if (liEl && liEl.length) {
				liEl = liEl[0];

				const fileId = liEl.getAttribute('data-id');

				liEl.parentNode.removeChild(liEl);

				removeFile(fileId);

				if (!filesToUpload.length) {
					previewHintEl.style.display = 'none';
				}

				if (filesToUpload.length < maxFiles) {
					dropzoneEl.style.display = 'table-cell';
				}
			}
		});

		dropzoneEl.addEventListener('click', () => {
			input.click();
		});

		const getFileId = (file) => {
			return file.name.replace(/\W/g, '_').toLowerCase() + file.size + file.type.replace(/\W/g, '_').toLowerCase();
		};

		const fileExists = (file) => {
			for (let i = 0; i < filesToUpload.length; i++) {
				let match = true;

				['name', 'size', 'type'].forEach((key) => {
					if (filesToUpload[i][key] !== file[key]) {
						match = false;
					}
				});

				if (match) {
					return true;
				}
			}

			return false;
		};

		const removeFile = (fileId) => {
			for (let i = 0; i < filesToUpload.length; i++) {
				if (fileId === getFileId(filesToUpload[i])) {
					filesToUpload.splice(i, 1);
					return true;
				}
			}

			return false;
		};

		const handleNewFiles = (files) => {
			if (files && files.length) {
				if (files.length + filesToUpload.length > maxFiles) {
					lrAlert(`The maximum allowed number of files (${maxFiles}) is exceeded. Please try again.`);
					return;
				}

				for (let i = 0; i < files.length; i++) {
					const file = files[i];

					if (allowedFileTypes.indexOf(file.type) === -1) {
						lrAlert("File " + file.name + " has a not allowed file type.");
						continue;
					}

					if (fileExists(file)) {
						continue;
					}

					const fileId = getFileId(file);

					filesToUpload.push(file);


					const li = document.createElement('li');
					const imgPreview = document.createElement('div');
					const name = document.createElement('div');

					imgPreview.classList.add('lr-upload-preview-image');
					name.innerHTML = file.name;
					name.classList.add('lr-upload-file-name');

					li.setAttribute('data-id', fileId);

					li.appendChild(imgPreview);
					li.appendChild(name);
					previewEl.appendChild(li);


					if (imageTypes.indexOf(file.type) !== -1) {
						const reader = new FileReader();

						reader.onload = function (e) {
							imgPreview.style.backgroundImage = `url(${e.target.result})`;
						};

						reader.readAsDataURL(file);
					} else {
						imgPreview.classList.add(`lr-upload-preview-ext-${fileTypesIcons[file.type]}`);
					}
				}

				if (filesToUpload.length >= maxFiles) {
					dropzoneEl.style.display = 'none';
				}

				previewHintEl.style.display = 'block';
			}
		};



		const commonHandler = (e) => {
			e.preventDefault();
			e.stopPropagation();
		};
		const dragOverHandler = () => {
			dropzoneEl.classList.add('drag-over');
		};
		const dragLeaveHandler = () => {
			dropzoneEl.classList.remove('drag-over');
		};
		const dropHandler = (e) => {
			handleNewFiles(e.dataTransfer.files, 'drag');
		};

		['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((e) => {
			el.addEventListener(e, commonHandler);
		});

		['dragover', 'dragenter'].forEach((e) => {
			el.addEventListener(e, dragOverHandler);
		});
		['dragleave', 'dragend', 'drop'].forEach((e) => {
			el.addEventListener(e, dragLeaveHandler);
		});

		el.addEventListener('drop', dropHandler);


		input.addEventListener('change', () => {
			handleNewFiles(input.files, 'input');
		});
	} else {
		input.classList.remove('o--if-no-js');
	}


	this.files = function () {
		return filesToUpload;
	};

	this.name = function () {
		return input.getAttribute('name');
	};
}


const isAdvancedUpload = (function() {
	const div = document.createElement('div');
	return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}());

LongroomFileUpload.isAdvancedUpload = isAdvancedUpload;

module.exports = LongroomFileUpload;




const allowedFileTypes = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"text/xml",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"text/plain",
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.ms-powerpoint",
	"video/mp4",
	"video/mpeg",
	"audio/mp3",
	"audio/mpeg",
	"audio/wav"
];

const fileTypesIcons = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/gif": "gif",
	"text/xml": "xml",
	"application/msword": "doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
	"application/vnd.ms-excel": "xls",
	"text/plain": "txt",
	"application/pdf": "pdf",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": "ppt",
	"application/vnd.ms-powerpoint": "ppt",
	"video/mp4": "mp4",
	"video/mpeg": "mpg",
	"audio/mp3": "mp3",
	"audio/mpeg": "mp3",
	"audio/wav": "wav"
};

const imageTypes = [
	"image/png",
	"image/jpeg",
	"image/gif"
];

