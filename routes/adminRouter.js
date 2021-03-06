const router = require('express').Router();
const isEditor = require('../lib/middlewares/isEditor');
const adminCtrl = require('../lib/controllers/admin');

router.all('/', isEditor);
router.get('/', adminCtrl.index);
router.get('/approve/:user_id', adminCtrl.approve);
router.get('/reject/:user_id', adminCtrl.reject);
router.get('/suspend/:user_id', adminCtrl.suspend);
router.get('/reinstate/:user_id', adminCtrl.reinstate);

module.exports = router;
