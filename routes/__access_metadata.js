"use strict";

const router = new (require("express").Router)();
const fetch = require("node-fetch");

const av2AccessMetadata = [
	{
		path_regex:
			"/2019/07/17/1563366942000/Cryptokitties-get-duplicated-at-Vaudeville-with-Simon-Denny.*",
		classification: "unconditional", //AG: hack to make this one article free because Alphaville uses Wordpress for Access
	},
	{
		path_regex: "/curation.*",
		classification: "conditional_registered",
	},
	{
		path_regex: "/\\d{4}/\\d{2}/\\d{2}/\\d{1,}/.+",
		classification: "conditional_registered",
	},
    {
        path_regex: "/longroom/data/.*",
        classification: "conditional_registered",
    },
	{
		path_regex: "/longroom/user/setpseudonym.*",
		classification: "conditional_alphaville_longroom",
	},
	{
		path_regex: "/longroom/user/.*",
		classification: "conditional_registered",
	},
	{
		path_regex: "/longroom/.*",
		classification: "conditional_alphaville_longroom",
	},
	{
		path_regex: "/longroom.*",
		classification: "conditional_registered",
	},
	{
		path_regex: ".*",
		classification: "unconditional",
	},
];

let wpAccessMetadata = [];

// function fetchFreeArticles() {
// 	const url = `${process.env.PROD_WP_URL}/__access_metadata`;

// 	return fetch(url)
// 		.then((res) => res.json())
// 		.then((json) => {
// 			if (json && json.access_metadata) {
// 				wpAccessMetadata = [];

// 				json.access_metadata.forEach((item) => {
// 					if (
// 						item.path_regex &&
// 						item.path_regex.match(/^(\/[0-9]+\/[0-9]+\/[0-9]+\/[0-9]+\/.*)$/)
// 					) {
// 						wpAccessMetadata.push(item);
// 					}
// 				});
// 			}
// 		})
// 		.catch((err) => {
// 			console.log("Error fetching access metadata", err);
// 		});
// }

// fetchFreeArticles();
// setInterval(fetchFreeArticles, 60 * 1000);

router.get("/__access_metadata", (req, res) => {
	res.set({
		"surrogate-control": `max-age=600`,
		"stale-while-revalidate": 600,
		"stale-if-error": 43200,
		"cache-control": "max-age=0, no-cache, must-revalidate",
	});

	res.json({
		access_metadata: [].concat(wpAccessMetadata).concat(av2AccessMetadata),
	});
});

module.exports = router;
