"use strict";

const router = new (require("express").Router)();
const fetch = require("node-fetch");

const av2AccessMetadata = [
	{
		path_regex: "/\\d{4}/\\d{2}/\\d{2}/\\d{1,}/.+",
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

router.get("/__access_metadata", (req, res) => {
	res.set({
		"surrogate-control": `max-age=600`,
		"stale-while-revalidate": 600,
		"stale-if-error": 43200,
		"cache-control": "max-age=0, no-cache, must-revalidate",
	});

	res.json({
		access_metadata: av2AccessMetadata,
	});
});

module.exports = router;
