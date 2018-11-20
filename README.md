# alphaville-longroom

Renders the pages of alphaville longroom page.

## Prerequisite
Origami build tools https://github.com/Financial-Times/origami-build-tools#usage

```
npm install -g origami-build-tools
```

Install prerequisites of origami build tools:

```
obt install
```

Install gulp globally:

```
npm install -g gulp
```

Install postgreSQL locally
https://www.postgresql.org/download/

Create a database called longroom.
Import `schema.sql`.

## Install
Run the following:

You'll need to create environment variable

The fastest way to do this is to run the following assuming your are logged in into heroku

```
heroku config -s  >> .env --app av2-longroom-test
```
Define the local database URL 

```
DATABASE_URL="postgres://postgres@database:5432/longroom"
```

Now run the initial npm install on the app

```
npm install
```

This will not just install npm modules, but automatically run bower install and gulp build as well.

The build integrates origami build tools, so before this please make sure you have all the prerequisites needed for it: https://github.com/Financial-Times/origami-build-tools#usage



## Start the app

Run the following:

```
heroku local
```
