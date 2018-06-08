document.addEventListener('o.DOMContentLoaded', () => {
	const joinForm = document.querySelector('.lr-join-form');

	if (joinForm) {
		const errorContainers = joinForm.querySelectorAll('.o-forms__errortext');

		for (let i = 0; i < errorContainers.length; i++) {
			const formGroup = errorContainers[i].parentNode;

			const input = formGroup.querySelector('input');

			if (input) {
				(function (errorContainer) {
					input.addEventListener('keyup', () => {
						errorContainer.innerHTML = '';
						formGroup.classList.remove('o-forms--error');
					});
				}(errorContainers[i]));
			}


			const textarea = formGroup.querySelector('textarea');

			if (textarea) {
				(function (errorContainer) {
					textarea.addEventListener('keyup', () => {
						errorContainer.innerHTML = '';
						formGroup.classList.remove('o-forms--error');
					});
				}(errorContainers[i]));
			}


			const select = formGroup.querySelector('select');

			if (select) {
				(function (errorContainer) {
					select.addEventListener('change', () => {
						errorContainer.innerHTML = '';
						formGroup.classList.remove('o-forms--error');
					});
				}(errorContainers[i]));
			}
		}
	}
});
