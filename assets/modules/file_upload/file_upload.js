function LongroomFileUpload (el) {
	el.classList.add('lr-upload');

	const input = el.querySelector('input[type="file"]');

	const filesToUpload = [];

	if (isAdvancedUpload) {
		el.classList.add('draganddrop');

		const dropzone = document.createElement('div');
		dropzone.classList.add('lr-upload-dropzone');
		dropzone.innerHTML = 'Drag and Drop or select file';
		el.appendChild(dropzone);
		const dropzoneEl = el.querySelector('.lr-upload-dropzone');

		const previewList = document.createElement('ul');
		previewList.classList.add('lr-upload-preview');
		el.appendChild(previewList);
		const previewEl = el.querySelector('.lr-upload-preview');

		dropzoneEl.addEventListener('click', () => {
			input.click();
		});

		const handleNewFiles = (files) => {
			if (files && files.length) {
				for (let i = 0; i < files.length; i++) {
					const file = files[i];

					filesToUpload.push(file);

					if (allowedFileTypes.indexOf(file.type) === -1) {
						alert("File " + file.name + " has a not allowed file type.");
						continue;
					}

					const li = document.createElement('li');
					const imgPreview = document.createElement('div');
					const name = document.createElement('div');

					imgPreview.classList.add('lr-upload-preview-image');
					name.innerHTML = file.name;
					name.classList.add('lr-upload-file-name');

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



/*
function getParents (elem, selector) {
	let firstChar;
	const parents = [];

	if (selector) {
		firstChar = selector.charAt(0);
	}

	// Get matches
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (selector) {
			// If selector is a class
			if (firstChar === '.') {
				if (elem.classList.contains(selector.substr(1))) {
					parents.push(elem);
				}
			}

			// If selector is an ID
			if (firstChar === '#') {
				if (elem.id === selector.substr(1)) {
					parents.push(elem);
				}
			}

			// If selector is a data attribute
			if (firstChar === '[') {
				if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
					parents.push(elem);
				}
			}

			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				parents.push(elem);
			}
		} else {
			parents.push(elem);
		}
	}

	// Return parents if any exist
	if (parents.length === 0) {
		return null;
	} else {
		return parents;
	}

};
*/
