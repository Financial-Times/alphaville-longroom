var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Alphaville Longroom' });
});
router.get('/longroom', (req, res) => {
	res.sendStatus(200);
});
router.get('/__gtg', (req, res) => {
	res.sendStatus(200);
});

module.exports = router;
