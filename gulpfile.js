"use strict";

const gulp = require('gulp');
const del = require("del");
const exec = require("child_process").exec;
const fork = require("child_process").fork;
const fs = require("fs");
const path = require("path");

const env = process.env.ENVIRONMENT || 'test';

function ensureDirectoryExistence(filePath) {
	const dirname = path.dirname(filePath);

	if (directoryExists(dirname)) {
		return true;
	}

	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}

function directoryExists(path) {
	try {
		return fs.statSync(path).isDirectory();
	} catch (err) {
		return false;
	}
}

function generateRandomString(length) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

const alphavilleBuildTools = function (gulp, config) {
	const buildFolder = config["build-folder"] || "public/build";
	const env = config.env === "prod" ? "prod" : "test";

	gulp.task("build-config-dir", function (done) {
		ensureDirectoryExistence("build_config/js/test.js");
		ensureDirectoryExistence("build_config/scss/test.scss");
		done();
	});

	gulp.task("fingerprint", function (callback) {
		const fingerprint = generateRandomString(10);

		fs.writeFileSync(
			"build_config/js/fingerprint.js",
			`module.exports="${fingerprint}";`
		);
		fs.writeFileSync(
			"build_config/scss/fingerprint.scss",
			`$fingerprint: '${fingerprint}';`
		);
		callback();
	});

	gulp.task("assets-domain-config", function (callback) {
		const assetsDomain = "";

		fs.writeFileSync(
			"build_config/js/assetsDomain.js",
			`module.exports="${assetsDomain}";`
		);
		fs.writeFileSync(
			"build_config/scss/assetsDomain.scss",
			`$assets-domain: '${assetsDomain}';`
		);

		callback();
	});

	gulp.task("bower-install", function (callback) {
		exec("./node_modules/bower/bin/bower install", callback);
	});

	gulp.task("bower-cache-clean", function (callback) {
		exec("./node_modules/bower/bin/bower cache clean", callback);
	});

	gulp.task("bower-folder-clean", function (callback) {
		del(["./bower_components"], callback);
	});

	gulp.task(
		"bower-clean",
		gulp.series("bower-cache-clean", "bower-folder-clean")
	);

	gulp.task("clean-build", function (callback) {
		del([buildFolder], callback);
	});

	gulp.task("obt-verify", function (callback) {
		exec("./node_modules/.bin/obt verify", callback);
	});

	const buildTasks = [];
	config.builds.forEach(function (buildConfig) {
		const baseBuildConfig = {};

		baseBuildConfig["build-folder"] = buildFolder;

		if (env) {
			baseBuildConfig.env = env === "prod" ? "production" : "development";
		}

		Object.assign(baseBuildConfig, buildConfig);

		const buildTaskName =
			"obt-build-" + (buildConfig.id || generateRandomString(5));
		buildTasks.push(buildTaskName);

		gulp.task(buildTaskName, function (callback) {
			let command = "./node_modules/.bin/obt";
			let args = ["build"];

			Object.keys(baseBuildConfig).forEach((key) => {
				args.push(`--${key}`, baseBuildConfig[key]);
			});

			const runCmd = fork(command, args);
			runCmd.on("error", (err) => console.log(err));
			runCmd.on("close", () => {
				callback();
			});
		});
	});

	gulp.task("obt-build", gulp.series(...buildTasks));

	gulp.task("verify", gulp.series("obt-verify"));
	gulp.task(
		"build",
		gulp.series(
			"clean-build",
			"build-config-dir",
			"fingerprint",
			"assets-domain-config",
			"obt-build"
		)
	);

	gulp.task("obt", gulp.series("verify", "build"));

	gulp.task("default", gulp.series("bower-clean", "bower-install", "build"));

	gulp.task("watch", function () {
		gulp.watch(["./assets/**"], ["obt-build"]);
	});

	return gulp;
};

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
