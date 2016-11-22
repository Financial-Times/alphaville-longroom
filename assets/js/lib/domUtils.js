exports.toDOM = function (htmlString) {
	const d = document;
	let i;
	const a = d.createElement("div");
	const b = d.createDocumentFragment();

	a.innerHTML = htmlString;

	while (a.firstChild) {
		i = a.firstChild;
		b.appendChild(i);
	}

	return b;
};


exports.getParents = function (elem, selector) {
	let firstChar;
	const parents = [];

	if (selector) {
		firstChar = selector.charAt(0);
	}

	// Get matches
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (selector) {
			// If selector is a class
			if (firstChar === '.') {
				if (elem.classList.contains(selector.substr(1))) {
					parents.push(elem);
				}
			}

			// If selector is an ID
			if (firstChar === '#') {
				if (elem.id === selector.substr(1)) {
					parents.push(elem);
				}
			}

			// If selector is a data attribute
			if (firstChar === '[') {
				if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
					parents.push(elem);
				}
			}

			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				parents.push(elem);
			}
		} else {
			parents.push(elem);
		}
	}

	// Return parents if any exist
	if (parents.length === 0) {
		return null;
	} else {
		return parents;
	}

};
