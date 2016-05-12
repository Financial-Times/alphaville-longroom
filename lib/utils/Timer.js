"use strict";

const Timer = function () {
	let startTime = new Date();

	this.getElapsedTime = function () {
		return new Date().getTime() - startTime.getTime();
	};
};

module.exports = Timer;
