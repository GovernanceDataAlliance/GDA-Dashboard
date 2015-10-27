# GDA Dashboard

The Governance Data Alliance is a group of NGOs, governments, firms, and
donors who are working to improve the quality, availability, breadth,
and use of governance data.

The GDA Dashboard is a web application that illustrates how countries
are performing for a number of indicators created by the GDA partners.

## Getting set up

The dashboard is powered by
[Jekyll](https://upload.wikimedia.org/wikipedia/commons/7/78/Dr_Jekyll_and_Mr_Hyde_poster_edit2.jpg).
Once you've installed the Jekyll gem, you can use the `jekyll` command
to build and run the application:

```
bundle install
jekyll serve
```

[Go go go!](http://localhost:4000)

## Deployment

### Staging

The app is staged on Github Pages, which is easy to deploy to:

```
git push origin develop:gh-pages
```

Github Pages handles all the building, etc. for you. [Check it
out!](http://vizzuality.github.io/GDA-Dashboard)
