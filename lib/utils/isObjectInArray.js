const isObjectInArray = function (arr, toMatch) {
	if (!toMatch.length) {
		toMatch = [toMatch];
	}

	for (let i = 0; i < arr.length; i++) {
		let match = true;

		toMatch.forEach(matchItem => {
			if (arr[i][matchItem.key] !== matchItem.value) {
				match = false;
			}
		});

		if (match) {
			return true;
		}
	}

	return false;
};

module.exports = isObjectInArray;
