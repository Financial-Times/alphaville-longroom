document.addEventListener('o.DOMContentLoaded', () => {
	const joinForm = document.querySelector('.lr-join-form');

	if (joinForm) {
		const errorContainers = joinForm.querySelectorAll('.o-forms-errortext');

		for (let i = 0; i < errorContainers.length; i++) {
			const input = errorContainers[i].parentNode.querySelector('input');

			if (input) {
				(function (errorContainer) {
					input.addEventListener('keyup', () => {
						errorContainer.innerHTML = '';
					});
				}(errorContainer[i]));
			}

			const select = errorContainers[i].parentNode.querySelector('select');

			if (select) {
				(function (errorContainer) {
					select.addEventListener('change', () => {
						errorContainer.innerHTML = '';
					});
				}(errorContainer[i]));
			}
		}
	}
});
