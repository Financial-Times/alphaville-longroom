require('./assets');
require('alphaville-ui');
require('o-expander');
if (window.commentsTalkReplacement || window.commentsUseCoral) {
	// Temporary addition until the comments are replaced
	require('o-comments-beta');
} else {
	require('o-comments');
}
require('o-comment-count');
require('./lib/deleteButton');
require('./lib/ads');
