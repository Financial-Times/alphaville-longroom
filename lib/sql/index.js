const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

const sql = (file) => {
	const fullPath = path.join(__dirname, file);
	const options = {
		minify: true
	};
	return new QueryFile(fullPath, options);
};

module.exports = {
	user: {
		join: sql('user/join.sql')
	}
};
