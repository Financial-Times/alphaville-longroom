const router = require('express').Router();
const apiCtrl = require('../lib/controllers/api');

router.get('/delete-user', apiCtrl.deleteUser);

module.exports = router;
