"use strict";

const gulp = require('gulp');
const alphavilleBuildTools = require('alphaville-build-tools');

const env = process.env.ENVIRONMENT || 'test';

alphavilleBuildTools(gulp, {
	env: env,
	'build-folder': 'public/build',
	builds: [
		{
			id: 'main',
			standalone: 'mainBundle',
			js: './assets/js/main.js',
			sass: './assets/scss/main.scss',
			'build-js': 'main.js',
			'build-css': 'main.css'
		},
		{
			id: 'wysiwyg',
			sass: './assets/scss/tinymce_wysiwyg.scss',
			'build-css': 'tinymce_wysiwyg.css'
		}
	]
});
