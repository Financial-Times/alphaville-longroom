const contentId = document.documentElement.dataset.contentId;
const Permutive = require('alphaville-ui')['permutive'];

Permutive.initPermutive();
Permutive.setUserAndContent(contentId);
Permutive.setPermutiveSegments();
