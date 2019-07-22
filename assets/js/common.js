require('./assets');
require('alphaville-ui');
require('o-expander');
if (window.commentsTalkReplacement || window.commentsUseCoralTalk) {
	// Temporary addition until the comments are replaced
	require('o-comments-beta');
} else {
	require('o-comments');
}
require('./lib/deleteButton');
require('./lib/ads');
