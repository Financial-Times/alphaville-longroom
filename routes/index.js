const express = require('express');
const router = new express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('alphaville-auth-middleware');
const multer = require('multer');

router.use('/', auth());

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Alphaville Longroom'
	});
});

router.get('/create', (req, res) => {
	res.render('create_form', {
		title: 'Alphaville Longroom',
		h1: 'Write a new post'
	});
});


const storageDirPath = path.join(__dirname, '..', 'tmp');
const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, storageDirPath);
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	}
});

const upload = multer({
	storage: storage
});

if (!fs.existsSync(storageDirPath)) {
	fs.mkdirSync(storageDirPath);
}

router.post('/create', upload.array('post-file'), (req, res) => {
	setTimeout(function () {
		req.files.forEach((file) => {
			fs.unlinkSync(file.path);
		});
	}, 100);

	if (req.xhr) {
		res.json({
			success: true
		});
	} else {
		if (req.body.upload === 'iframe') {
			res.setHeader('Content-type', 'text/html');
			res.send({
				success: true
			});
		} else {
			res.render('create_form', {
				title: 'Alphaville Longroom',
				h1: 'Write a new post'
			});
		}
	}
});



module.exports = router;
