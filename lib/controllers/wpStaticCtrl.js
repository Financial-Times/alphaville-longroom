'use strict';

const fetch = require('node-fetch');
// const cacheHeaders = require('../utils/cacheHeaders');

module.exports = function (view, url, adZone, navSelected) {
	return (req, res, next) => {
		// console.log('url: ', `${process.env['PROD_WP_URL']}/${url}?json=1&api_key=${process.env['WP_API_KEY']}`);
		
		const getStaticPage = fetch(`${process.env['PROD_WP_URL']}/${url}?json=1&api_key=${process.env['WP_API_KEY']}`).then(res => res.json());
		return getStaticPage.then((staticPage) => {

			// console.log('staticPage: ', staticPage);

			let viewModel = {
				title: staticPage.page.title + ' | Long Room | FT Alphaville',
				navSelected : navSelected,
				article : {
					body: staticPage.page.content,
					title: staticPage.page.title
				},
				adZone: adZone
			};

			// cacheHeaders.setCache(res, 300);
			res.render(view, viewModel);
		}).catch(next);
	};
};
