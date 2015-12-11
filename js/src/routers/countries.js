var Backbone = require('backbone'),
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
    var params =  URI("?" + window.location.hash.split("?")[1])._parts.query != 'undefined' ? URI("?" + window.location.hash.split("?")[1]).query(true) : null;

    var countries = params && params['countries[]'] ? params['countries[]'] : null;
    
    if (!this.views.hasView('compare')) {
      var view = new CompareView({countries: countries});
      this.views.addView('compare', view);
    } else {
      this.views.getView('compare').setCountries(countries);
    }

    this.views.showView('compare');
  }

});

module.exports = Router;
