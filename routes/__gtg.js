var express = require('express');
var router = express.Router();

router.get('/__gtg', (req, res) => {
	res.sendStatus(200);
});

module.exports = router;
