require('./assets');
require('alphaville-ui');
// Temporary addition until the comments are replaced
if (window.commentsUseCoralTalk) {
	require('o-comments-beta');
} else {
	require('o-comments');
}
require('./lib/deleteButton');
require('./lib/permutive');
require('./lib/ads');
