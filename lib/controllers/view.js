"use strict";

const db = require('../services/db').db;
const fileTypes = require('../utils/fileTypes');

module.exports = function (req, res, next) {
	/*if (req.params.id) {
		db.any('SELECT * FROM discussions WHERE id=$1', req.params.id).then((discussion) => {
			if (!discussion || !discussion.length) {
				return next();
			}

			discussion = discussion[0];

			db.any('SELECT * FROM files WHERE discussion_id=$1', req.params.id).then((files) => {
				if (!files || !files.length) {
					files = [];
				}

				const images = [];
				const otherFiles = [];

				files.forEach((file) => {
					if (fileTypes.images.indexOf(file.mimetype) !== -1) {
						images.push(file);
					} else {
						file.icon = fileTypes.categories[file.mimetype];
						otherFiles.push(file);
					}
				});

				res.render('discussion', {
					title: 'Alphaville Longroom',
					discussion: discussion,
					files: otherFiles,
					images: images
				});
			}).catch((err) => {
				next(err);
			});
		}).catch((err) => {
			next(err);
		});
	}*/
};
