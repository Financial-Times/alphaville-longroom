const oAds = require('alphaville-ui')['o-ads'];

document.addEventListener('o.DOMContentLoaded', function () {
	const inArticleAd1 = document.querySelector('.alphaville-in-article-ad1');
	const inArticleAd2 = document.querySelector('.alphaville-in-article-ad2');

	const linesNumber = document.querySelectorAll('.alphaville-card__standfirst > p');

	if (linesNumber && inArticleAd1 && inArticleAd2) {
		if (linesNumber.length > 0) {
			if (linesNumber.length > 2) {
				const thirdLine = linesNumber[2];
				thirdLine.parentNode.insertBefore(inArticleAd1, thirdLine.nextSibling);

				if (linesNumber.length > 8) {
					const eighthLine = linesNumber[8];
					eighthLine.parentNode.insertBefore(inArticleAd2, eighthLine.nextSibling);
					inArticleAd2.classList.add('alphaville-in-article-ad--mobile-only');
					oAds.init(inArticleAd2);
				}
			} else {
				const lastLine = linesNumber[linesNumber.length - 1];
				lastLine.parentNode.insertBefore(inArticleAd1, lastLine.nextSibling);
			}
		}

		oAds.init(inArticleAd1);
	}
});
