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

### Install PostgreSQL (optional)

**Skip this step if you are not working on the database itself - you can just use the database from the TEST environment.**

However, if you need to work on the database locally, you should have one installed on your machine as well.

Follow the official documentation on how to download and install postgreSQL locally: https://www.postgresql.org/download/
The easiest way is to import a dump from the TEST database.

Install postgreSQL locally
https://www.postgresql.org/download/

Create a database called longroom.
Import `schema.sql`.

Run the following:

Define the local database URL 

```
DATABASE_URL="postgres://postgres@database:5432/longroom"
```

### Run locally

Create environment variables by copying them from the Heroku app by running the following command (you will need to be logged into Heroku):

```
heroku config -s  >> .env --app av2-longroom-prod
```
now install and run with

```
make run-dev
```

(Under the hood `make run-dev` uses `Heroku local` which installs npm modules, as well as bower install and gulp build.)

Visit `http://local.ft.com:5001/longroom` to see the app running locally. Note, you will need to be on `http`. 

The build integrates origami build tools, so before this please make sure you have all the prerequisites needed for it: https://github.com/Financial-Times/origami-build-tools#usage



## Start the app

Run the following:

```
heroku local
```

## Deployment

Alphaville Longroom does not have a CI deployment set up. Once you have tested everything, go to heroku and deploy from the deployment tab for `av2-longroom-test` and then `av2-longroom-prod`.

### Article access

In order you to be able to access articles without getting the barrier, you will need 2 things:

Set up a URL in the hosts file that points local.ft.com to the localhost
Add SKIP_AUTH=true environment variable (this is needed because running the app locally there's no fastly service in front of the app to set the Decision header from the Access service).

### Joining/license allocation

If you have to work on the joining/license allocation area, the app will need to have access to the `FTSession_s` in order to access the User API service. There are 2 ways you could achieve this:

1. run the app locally on https
2. Manually copy the value of `FTSession_s` into a cookie with the same name, but available on `http` as well.

### Rotating Keys

Documentation specific to this app is [here](https://docs.google.com/document/d/1bILX3O37XmhKOtpWvox9BeZ6RW4-aOn9VzmNqc16BcQ/edit#heading=h.y5t7y6rwe8sa).
