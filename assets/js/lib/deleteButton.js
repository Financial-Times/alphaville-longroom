const Delegate = require('dom-delegate');
const ConfirmOverlay = require('alphaville-ui').ConfirmOverlay;

document.addEventListener('o.DOMContentLoaded', () => {
	const deleteDelegate = new Delegate(document.body);

	deleteDelegate.on('click', '.lr-content--delete', (evt) => {
		const postId = evt.target.getAttribute('data-post-id');

		new ConfirmOverlay('Delete post', 'Are you sure you want to delete this post?').then(decision => {
			if (decision) {
				document.location.href = `/longroom/content/${postId}/delete`;
			}
		});

		evt.preventDefault();
	});
});
