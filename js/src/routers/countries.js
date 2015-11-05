var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
    CountryView = require('../views/countries/country.js');

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
  },

  show: function(iso) {
    if (!this.views.hasView('show')) {
      var view = new CountryView({iso: iso});
      this.views.addView('show', view);
    }

    this.views.showView('show');
  },

  compare: function() {
  }

});

module.exports = Router;
