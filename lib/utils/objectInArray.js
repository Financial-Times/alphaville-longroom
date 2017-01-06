const getObjectInArray = function (arr, toMatch) {
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
			return arr[i];
		}
	}

	return null;
};

const isObjectInArray = function (arr, toMatch) {
	if (getObjectInArray(arr, toMatch) !== null) {
		return true;
	}

	return false;
};

exports.isObjectInArray = isObjectInArray;
exports.getObjectInArray = getObjectInArray;
