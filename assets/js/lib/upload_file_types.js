exports.allowedFileTypes = [
	"application/msword",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/pdf"
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
	"pdf": "application/pdf"
};
