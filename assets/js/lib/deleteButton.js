const Delegate = require('dom-delegate');
const ConfirmOverlay = require('alphaville-ui').ConfirmOverlay;

document.addEventListener('o.DOMContentLoaded', () => {
	const deleteDelegate = new Delegate(document.body);

	deleteDelegate.on('click', '.lr-action--delete', (evt) => {
		const postId = evt.srcElement.getAttribute('data-post-id');

		new ConfirmOverlay('Delete post', 'Are you sure you want to delete this post?').then(decision => {
			if (decision) {
				document.location.href = `/longroom/content/${postId}/delete`;
			}
		});

		evt.preventDefault();
	});
});
