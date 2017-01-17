const oAds = require('alphaville-ui')['o-ads'];

function checkInArticleAd () {
	const inArticleAd1 = document.querySelector('.alphaville-in-article-ad1');
	const inArticleAd2 = document.querySelector('.alphaville-in-article-ad2');

	inArticleAd2.style.display = 'none';

	const linesNumber = document.querySelectorAll('.alphaville-card__standfirst > p');

	if (linesNumber && inArticleAd1 && inArticleAd2) {
		if (linesNumber.length > 0) {
			if (linesNumber.length > 2) {
				const thirdLine = linesNumber[2];
				thirdLine.parentNode.insertBefore(inArticleAd1, thirdLine.nextSibling);

				if (linesNumber.length > 8) {
					const eighthLine = linesNumber[8];
					eighthLine.parentNode.insertBefore(inArticleAd2, eighthLine.nextSibling);
					inArticleAd2.style.display = 'block';
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

	const linesNumber = document.querySelectorAll('.lr-faq-page .body dt');

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

function checkInHouseRulesAd () {
	const inHouserulesAd1 = document.querySelector('.alphaville-in-houserules-ad1');
	const inHouserulesAd2 = document.querySelector('.alphaville-in-houserules-ad2');
	const inHouserulesAd3 = document.querySelector('.alphaville-in-houserules-ad3');

	const h2Number = document.querySelectorAll('.lr-house_rules-page .body h2');

	if (h2Number && inHouserulesAd1 && inHouserulesAd2 && inHouserulesAd3) {
		if (h2Number.length > 0) {
			if (h2Number.length > 1) {
				const component1 = h2Number[1];
				component1.parentNode.insertBefore(inHouserulesAd1, component1);
				component1.parentNode.insertBefore(inHouserulesAd2, component1);

				oAds.init(inHouserulesAd2);

				if (h2Number.length > 3) {
					const component2 = h2Number[3];
					component2.parentNode.insertBefore(inHouserulesAd3, component2);
				}
			} else {
				const lastLine = h2Number[h2Number.length - 1];
				lastLine.parentNode.insertBefore(inHouserulesAd1, lastLine);
				lastLine.parentNode.insertBefore(inHouserulesAd3, lastLine);
			}
		}

		oAds.init(inHouserulesAd1);
		oAds.init(inHouserulesAd3);
	}
}

document.addEventListener('o.DOMContentLoaded', function () {
	checkInArticleAd();
	checkInFaqAd();
	checkInHouseRulesAd();
});
