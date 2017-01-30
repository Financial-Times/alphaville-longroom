const httpRequest = require('./httpRequest');

function getSignedRequest (file, uploadType) {
	return httpRequest.get({
		url: '/longroom/files/sign',
		dataType: 'json',
		query: {
			'file-name': file.name,
			'file-type': file.type,
			'file-size': file.size,
			'upload-type': uploadType || 'attachment'
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

exports.uploadFile = function (fileInfo, onProgress) {
	return getSignedRequest(fileInfo, 'attachment')
		.then(data => {
			return httpRequest.put({
				url: data.signedRequest,
				body: fileInfo.file,
				dataType: 'json',
				contentType: data.fileType,
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
};

exports.uploadImage = function (fileInfo, onProgress) {
	return getSignedRequest(fileInfo, 'embedded')
		.then(data => {
			return httpRequest.put({
				url: data.signedRequest,
				body: fileInfo.file,
				dataType: 'json',
				contentType: data.fileType,
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
