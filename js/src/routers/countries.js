var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
    CountryView = require('../views/countries/country.js'),
    CountriesView = require('../views/countries/countries.js');

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
  }

});

module.exports = Router;
