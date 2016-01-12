var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash'),
    URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
    CountryView = require('../views/countries/country.js'),
    CountriesView = require('../views/countries/countries.js'),
    CompareView = require('../views/countries/compare.js');

var Router = Backbone.Router.extend({

  routes: {
    "compare": "compare",
    ":iso": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this.setListeners();
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countrySelected).bind(this));
    Backbone.Events.on('year:selected', (this.yearSelected).bind(this));
  },

  index: function() {
    if (!this.views.hasView('index')) {
      var view = new CountriesView();
      this.views.addView('index', view);
    }

    this.views.showView('index');
  },

  show: function(iso) {
    if (!this.views.hasView('show')) {
      var view = new CountryView({iso: iso});
      this.views.addView('show', view);
    } else {
      this.views.getView('show').setCountry(iso);
    }

    this.views.showView('show');
  },

  compare: function() {
    var params =  URI("?" + window.location.hash.split("?")[1]).query(true);

    this.countries = params && params['countries[]'] ? params['countries[]'] : [];
    this.year = params && params['year[]'] ? params['year[]'] : (new Date).getFullYear() - 1;

    //When only one value, string instead of array. We need array.
    if ( _.isString(this.countries)) {
      this.countries = [ this.countries ];
    };

    if (!this.views.hasView('compare')) {
      var view = new CompareView({ 
        'countries': this.countries, 
        'year': this.year
      });
      this.views.addView('compare', view);
    } else {
      this.views.getView('compare').setParams(this.countries, this.year)
    }

    this.views.showView('compare');
  },

  //Update countries params
  countrySelected: function(iso, order) {
    this.countries[order - 1] = iso;
    this.updateUrl();
  },

  //Update year params
  yearSelected: function(year) {
    this.year = year;
    this.updateUrl();
  },

  //Update URL
  updateUrl: function() {
    var hashCountries = 'compare?';
    var hasYear;

    $.each(this.countries, function(i, country) {
      hashCountries = hashCountries + 'countries[]=' + country + '&';
    }.bind(this));

    hasYear = 'year[]=' + this.year;

    this.navigate(hashCountries + hasYear);
  }
});

module.exports = Router;
