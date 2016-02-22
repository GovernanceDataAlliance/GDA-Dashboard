var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  CountryView = require('../views/countries/country.js'),
  CountriesView = require('../views/countries/countries.js'),
  WrapperHeaderView = require('../views/common/wrapper_header_view.js');

var Router = Backbone.Router.extend({

  routes: {
    ":iso": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this.setListeners();

    new WrapperHeaderView();
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
