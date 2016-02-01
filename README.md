# GDA Dashboard

The Governance Data Alliance is a group of NGOs, governments, firms, and
donors who are working to improve the quality, availability, breadth,
and use of governance data.

The GDA Dashboard is a web application that illustrates how countries
are performing for a number of indicators created by the GDA partners.

## Getting set up

The dashboard is powered by
[Jekyll](https://upload.wikimedia.org/wikipedia/commons/7/78/Dr_Jekyll_and_Mr_Hyde_poster_edit2.jpg).
Once you've installed the Jekyll gem and other deps, you can use npm to
build and run the application:

```
gem install bundler
bundle install
npm install
npm install -g grunt-cli

npm start
```

[Go go go!](http://localhost:4000)

## Testing

Write tests for as much as you can. Generally we're not writing
integration level tests here, just unit tests for the non-view modules,
but test to the level that you feel comfortable with.

Run the tests with Grunt:

```
grunt test
```

If you want to view tests in the browser, run `grunt build` and open up
`_SpecRunner.html`.

## Jekyll

### Adding new pages

In development, and on Github Pages, requests are rewritten to `.html`
files as necessary. For example, `/countries --> /countries.html`. So,
creating a new page is easy: just add a new HTML file! Jekyll will
handle compilation, and the middleware will handle rewriting.

## Deployment

### Continuous Integration

The app is staged on Github Pages, and is continuously deployed using
Travis. When code is pushed to `develop`, Travis will run the tests and
will automatically deploy to Github Pages if they pass. Take a look at
`/scripts/cibuild` if you want to see how it works.

### Staging

As said, the app is staged on Github Pages automatically, but there is a
command should you need to do it manually (probably never):

```
npm run deploy
```

Github Pages handles all the building, etc. for you. [Check it
out!](http://vizzuality.github.io/GDA-Dashboard)

A note on what this command doing: so that we don't have to constantly commit
compiled files (like js/bundle.js), we ignore them in Git and then force
push them up to gh-pages for deploys. Because of this, you should
*never* work directly on the gh-pages branch, it is entirely disposable.
