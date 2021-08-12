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
### Run locally

Create environment variables by copying them from the Heroku app by running the following command (you will need to be logged into Heroku):

```
heroku config -s  >> .env --app av2-longroom-prod
```

Now install and run with

```
make run-dev
```

Under the hood `make run-dev`:
- Uses `Heroku local` which installs npm modules, as well as bower install and gulp build.
- Adds a `SKIP_AUTH=true` environment variable which allows you to view content without hitting the barrier. This is needed because when running the app locally there's no Fastly service in front of the app to set the Decision header from the Access service.

View the app:
`http://local.ft.com:5001/longroom`

Note, you will need to be on `http`.

### Additional quirks of working locally: Joining/license allocation

If you have to work on the joining/license allocation area, including the join form, the app will need to have access to the `FTSession_s` in order to access the User API service. Because the app runs locally over `http` you will need to manually copy the value of `FTSession_s` into a cookie with the same name, but available on `http`, or even [manually set the cookie value directly in the code here](https://github.com/Financial-Times/alphaville-longroom/blob/main/lib/controllers/user.js#L28).

See below `Admin` section if you are working on the join form and want to test repeadlty with the same user.

### Additional quirks of working locally: Admin

The Admin page allows the Alphaville team to accept and reject join requests. If you are testing this functionality it's useful to be able to reject requests so that you can submit multiple join requests with the same user. To access this page locally you need to [comment out the line of code that checks whether a user is admin](https://github.com/Financial-Times/alphaville-longroom/blob/main/routes/adminRouter.js#L5).

**Take Note:** When you visit the admin page locally you will see production user requests to Alphaville and have the power to accept and reject them (which you should leave to the Alphaville Editorial team). Please navigate with care.

### Working locally on the database
If you want to work locally on the databse you will need to install PostgreSQL.

**Skip this step if you are not working on the database itself - you can just use the database from the TEST environment.**

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


## Deployment

Alphaville Longroom does not have a CI deployment set up. Once you have tested everything, go to heroku and deploy from the github in the deployment tab for `av2-longroom-test` and then, if the test app looks ok, promote to on the Heroku pipeline dashboard `av2-longroom-prod`.

### Rotating Keys

Documentation specific to this app is [here](https://docs.google.com/document/d/1bILX3O37XmhKOtpWvox9BeZ6RW4-aOn9VzmNqc16BcQ/edit#heading=h.y5t7y6rwe8sa).
