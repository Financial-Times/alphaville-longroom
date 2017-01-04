#alphaville-longroom

Renders the pages of alphaville longroom page.

## Install
Run the following:

Install npm dependencies.
```
npm install
```

Install bower dependencies.
```
bower install
```

Once the npm install is complete you'll need to create environment variable

The fastest way to do this is to run the following assuming your are logged in into heroku but this will bring keys that you might not need like keys for addons and such

```
heroku config -s  >> .env --app av2-longroom-test
```

Run the build.
```
gulp
```



## Start the app

Run the following:

```
heroku local
```

or

```
foreman start
```
