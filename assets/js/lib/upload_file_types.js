exports.allowedFileTypes = [
	"application/msword",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/pdf"
];

exports.allowedImageTypes = [
	"image/gif",
	"image/png",
	"image/jpeg",
	"image/bmp"
];

exports.fileTypesIcons = {
	"application/msword": "doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xls",
	"application/vnd.ms-excel": "xls",
	"application/pdf": "pdf"
};

exports.fileTypeByExtension = {
	"doc": "application/msword",
	"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"xls": "application/vnd.ms-excel",
	"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"pdf": "application/pdf",
	"gif": "image/gif",
	"png": "image/png",
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"bmp": "image/bmp"
};
