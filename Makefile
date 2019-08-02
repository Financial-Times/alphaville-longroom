-include .env

.env:
	heroku config -s  >> .env --app av2-longroom-test

bower_components:
	bower install

node_modules:
	npm install

install-tools:
	npm install -g bower; \
	npm install -g gulp

install: .env bower_components node_modules

clean:
	rm -rf .env bower_components node_modules

run-dev: install
	export SKIP_AUTH=true; \
	heroku local -p 5001
