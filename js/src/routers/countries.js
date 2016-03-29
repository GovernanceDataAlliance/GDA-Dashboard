var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  CountryView = require('../views/countries/country.js'),
  CountriesView = require('../views/countries/countries.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js');

var Router = Backbone.Router.extend({

  routes: {
    ":params": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this.setListeners();

    new MobileMenuView();
  },

  setListeners: function() {
    Backbone.Events.on('year:selected', this.updateParams, this);
  },

  index: function() {
    if (!this.views.hasView('index')) {
      var view = new CountriesView();
      this.views.addView('index', view);
    }

    this.views.showView('index');
  },

  show: function(params) {
    var configView = {
      iso: params.split("&")[0],
      year: params.split("&")[1] || null
    };

    if (!this.views.hasView('show')) {
      var view = new CountryView(configView);
      this.views.addView('show', view);
    } else {
      this.views.getView('show')._updateParams(configView)
    }

    this.views.showView('show');
  },


  //Update params
  updateParams: function(year) {
    this.year = year;
    this.updateUrl();
  },

  //Update URL
  updateUrl: function() {
    var stringYear = '',
      iso = window.location.hash.split('&')[0].slice(1);

    if (this.year) {
      stringYear = '&' + this.year;
    }

    this.navigate(iso + stringYear);
  }
});

module.exports = Router;
