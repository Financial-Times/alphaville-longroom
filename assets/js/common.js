const assetsDomain = require('../../build_config/js/assetsDomain');
const fingerprint = require('../../build_config/js/fingerprint');

require('o-assets').setGlobalPathPrefix(assetsDomain + '/assets/longroom/bower/' + fingerprint + '/');
