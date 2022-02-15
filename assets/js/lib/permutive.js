const adsPermutive = require('@financial-times/ads-permutive').default;

const getPageViewType = pageView => pageView && pageView.article
	? 'article'
	: 'homepage'

adsPermutive.setup();
adsPermutive.loadPermutiveScript();

// Wait for oAds to complete initialisation, in order to access the targeting meta
// and Then identify the user and track PageView
document.body.addEventListener('oAds.initialised', () => {
	// TODO - We need to figure out how to migrate to the new permutive library
	// we are using version 0.3.0
	// The latest version is 4.0.0 - we can't upgrade to v4 without changing the build-pipeline
	//

	// const [user, article] = oAds.api.data;
	// const pageView = adsPermutive.fromAdsApiV1ToPageView({ user, article });

	// adsPermutive.identifyUser({
	// 	uuid: user && user.uuid
	// });
	// pageView && pageView.page && (pageView.page.type = getPageViewType());
	// adsPermutive.trackPageView(pageView);
})
