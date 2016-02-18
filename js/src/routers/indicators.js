var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  IndicatorsView = require('../views/indicators/indicators.js'),
  IndicatorView = require('../views/indicators/indicator.js');

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
    if (!this.views.hasView('show')) {
      var view = new IndicatorView({id: id});
      this.views.addView('show', view);
    } else {
      this.views.getView('show').setIndicator(id);
    }

    this.views.showView('show');
  }

});

module.exports = Router;
