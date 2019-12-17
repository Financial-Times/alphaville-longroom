const router = require('express').Router();
const apiCtrl = require('../lib/controllers/api');

router.get('/delete-user', apiCtrl.deleteUser);
router.put('/sync-displayname/:uuid', apiCtrl.syncDisplayName);

module.exports = router;
