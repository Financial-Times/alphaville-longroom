"use strict";

const _ = require('lodash');

exports.getRenderConfig = function (currentPage, totalPages, req) {
	const queryParamsWithoutPage = _.omit(req.query, ['page']);
	const baseUrl = `${req.baseUrl}?${
			Object.keys(queryParamsWithoutPage).map(key => `${key}=${queryParamsWithoutPage[key]
		}${
			Object.keys(queryParamsWithoutPage).length ? '&' : ''
		}`).join('&')}`;

	return {
		left: currentPage === 1 ? false : {
			page: currentPage - 1
		},
		currentPage: currentPage,
		right: currentPage >= totalPages ? false : {
			page: currentPage + 1
		},
		baseUrl: baseUrl
	};
};
