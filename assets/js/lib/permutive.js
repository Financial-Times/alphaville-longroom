const nPermutive = require('n-permutive');

const PERMUTIVE_CREDENTIALS = {
	publicId: 'e1c3fd73-dd41-4abd-b80b-4278d52bf7aa',
	publicApikey: 'b2b3b748-e1f6-4bd5-b2f2-26debc8075a3',
}

const getAppName = targeting => targeting && targeting.auuid
	? 'article'
	: 'homepage';

nPermutive.setup(PERMUTIVE_CREDENTIALS);
nPermutive.loadPermutiveScript(PERMUTIVE_CREDENTIALS.publicId);

// Wait for oAds to complete initialisation, in order to access the targeting meta
// and Then identify the user and track PageView
document.body.addEventListener('oAds.initialised', () => {
	const targeting = oAds.targeting.get();

	nPermutive.identifyUser(targeting);
	nPermutive.trackPageView(targeting, getAppName(targeting), oAds.config('behavioralMeta'));
})
