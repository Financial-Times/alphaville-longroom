const oAds = require('alphaville-ui')['o-ads'];

function checkInArticleAd () {
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
					oAds.init(inArticleAd2);
				}
			} else {
				const lastLine = linesNumber[linesNumber.length - 1];
				lastLine.parentNode.insertBefore(inArticleAd1, lastLine.nextSibling);
			}
		}

		oAds.init(inArticleAd1);
	}
}

function checkInFaqAd () {
	const inFaqAd1 = document.querySelector('.alphaville-in-faq-ad1');
	const inFaqAd2 = document.querySelector('.alphaville-in-faq-ad2');

	const linesNumber = document.querySelectorAll('.lr-faq-page .body > ul');

	if (linesNumber && inFaqAd1 && inFaqAd2) {
		if (linesNumber.length > 0) {
			if (linesNumber.length > 5) {
				const fifthLine = linesNumber[5];
				fifthLine.parentNode.insertBefore(inFaqAd1, fifthLine);
				fifthLine.parentNode.insertBefore(inFaqAd2, fifthLine);
			} else {
				const lastLine = linesNumber[linesNumber.length - 1];
				lastLine.parentNode.insertBefore(inFaqAd1, lastLine);
				lastLine.parentNode.insertBefore(inFaqAd2, lastLine);
			}
		}

		oAds.init(inFaqAd1);
		oAds.init(inFaqAd2);
	}
}

document.addEventListener('o.DOMContentLoaded', function () {
	checkInArticleAd();
	checkInFaqAd();
});
