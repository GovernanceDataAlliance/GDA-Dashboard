var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
    IndicatorsView = require('../views/indicators/indicators.js');

var Router = Backbone.Router.extend({

  routes: {
    ":id": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  index: function() {
    if (!this.views.hasView('index')) {
      var view = new IndicatorsView();
      this.views.addView('index', view);
    }

    this.views.showView('index');
  },

  show: function(id) {
  }

});

module.exports = Router;
