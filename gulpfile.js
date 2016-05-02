"use strict";

const gulp = require('gulp');
const alphavilleBuildTools = require('alphaville-build-tools');

const env = process.env.ENVIRONMENT || 'test';

alphavilleBuildTools(gulp, {
	env: env,
	buildFolder: 'public/build',
	builds: [
		{
			id: 'main',
			standalone: 'mainBundle',
			js: './assets/js/main.js',
			sass: './assets/scss/main.scss',
			buildJs: 'main.js',
			buildCss: 'main.css'
		}
	]
});
