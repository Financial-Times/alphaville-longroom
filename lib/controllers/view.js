"use strict";

const db = require('../services/db');
const fileTypes = require('../utils/fileTypes');

module.exports = function (req, res, next) {
	if (req.params.id) {
		db.one('SELECT * FROM discussions WHERE id=$1', req.params.id).then((discussion) => {
			if (!discussion) {
				return next();
			}

			db.many('SELECT * FROM files WHERE discussion_id=$1', req.params.id).then((files) => {
				if (!files || !files.length) {
					return next();
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
	}
};
