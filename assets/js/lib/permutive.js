const nPermutive = require('n-permutive').default;

const getPageViewType = pageView => pageView && pageView.article
	? 'article'
	: 'homepage'

nPermutive.setup();
nPermutive.loadPermutiveScript();

// Wait for oAds to complete initialisation, in order to access the targeting meta
// and Then identify the user and track PageView
document.body.addEventListener('oAds.initialised', () => {
	const [user, article] = oAds.api.data;
	const pageView = nPermutive.fromAdsApiV1ToPageView({ user, article });

	nPermutive.identifyUser({
		uuid: user && user.uuid
	});
	pageView && pageView.page && (pageView.page.type = getPageViewType());
	nPermutive.trackPageView(pageView);
})
