const db = require('../services/db').db;

exports.tags = function (req, res) {
	if (req.query.q) {
		db.tag.selectSuggestion(req.query.q)
			.then(results => {
				res.json(results.map(item => {
					return {
						label: `${item.name} (${item.count})`,
						value: item.name
					};
				}));
			})
			.catch(err => {
				console.log(err);

				res.json([]);
			});
	} else {
		res.json([]);
	}
};
