# Load our shared build tools. See https://github.com/Financial-Times/n-gage for more information.
node_modules/@financial-times/n-gage/index.mk:
	npm install @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk
-include .env

VAULT_NAME=av2-longroom
HEROKU_APP_STAGING=av2-longroom-test
HEROKU_APP_EU=av2-longroom-prod

bower_components:
	bower install

node_modules:
	npm install

install-tools:
	npm install -g bower; \
	npm install -g gulp

clean:
	rm -rf .env bower_components node_modules

run-dev: install
	export SKIP_AUTH=true; \
	heroku local -p 5001

build:
	gulp
