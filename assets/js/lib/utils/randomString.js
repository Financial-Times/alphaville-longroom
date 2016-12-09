const randomString = function () {
	let text = "";
	const possible = "abcdefghijklmnopqrstuvwxyz";
	const length = (Math.random() + 1) * 10;

	for( let i=0; i < length; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

module.exports = randomString;
