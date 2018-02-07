const httpRequest = require('./httpRequest');


const upload = function (fileInfo, uploadType, onProgress) {
	const formData = new FormData();
	formData.append('file', fileInfo.file);

	return httpRequest.post({
		url: '/longroom/files/upload',
		body: formData,
		query: {
			'upload-type': uploadType
		},
		dataType: 'json',
		withCredentials: false,
		onProgress: onProgress
	}).then(data => {
		return {
			url: data.url,
			id: data.fileId,
			savedName: data.savedFileName
		};
	});
};

exports.uploadFile = function (fileInfo, onProgress) {
	return upload(fileInfo, 'attachment', onProgress);
};

exports.uploadImage = function (fileInfo, onProgress) {
	return upload(fileInfo, 'embedded', onProgress);
};

exports.deleteFile = function (fileId) {
	return httpRequest.post({
		url: '/longroom/files/delete',
		dataType: 'json',
		body: {
			'file-id': fileId
		}
	});
};
