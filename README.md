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

### Install PostgreSQL (optional)
You can skip this step if you are not working on the database itself and you can just use the database from the TEST environment.
However, if you need to work on the database locally, you should have one installed on your machine as well.

Follow the official documentation on how to download and install postgreSQL locally: https://www.postgresql.org/download/
The easiest way is to import a dump from the TEST database.

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

### Article access

In order you to be able to access articles without getting the barrier, you will need 2 things:

Set up a URL in the hosts file that points local.ft.com to the localhost
Add SKIP_AUTH=true environment variable (this is needed because running the app locally there's no fastly service in front of the app to set the Decision header from the Access service).

### Joining/license allocation

If you have to work on the joining/license allocation area, the app will need to have access to the `FTSession_s` in order to access the User API service. There are 2 ways you could achieve this:

1. run the app locally on https
2. Manually copy the value of `FTSession_s` into a cookie with the same name, but available on `http` as well.
