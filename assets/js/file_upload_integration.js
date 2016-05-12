const LongroomFileUpload = require('../modules/file_upload/file_upload');
const httpRequest = require('./httpRequest');

document.addEventListener('o.DOMContentLoaded', () => {
	const forms = document.querySelectorAll('form');
	if (forms && forms.length) {
		for (let i = 0; i < forms.length; i++) {
			const form = forms[i];
			const fileUploadsEl = form.querySelectorAll('.longroom-file-upload');
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
						//console.log('data received', data);
					}).catch((err) => {
						console.log('error', err);
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

						console.log(JSON.stringify(data));

						// handle success/failure

						iframe.parentNode.removeChild(iframe);
						form.setAttribute('target', target);
						form.removeChild(hiddenInput);
					});

					form.submit();
				}
			});
		}
	}
});


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
