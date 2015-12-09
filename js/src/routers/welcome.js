var Backbone = require('backbone'),
    URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
    WelcomeView = require('../views/welcome/welcome.js'),

var Router = Backbone.Router.extend({

  routes: {
    "/": "welcome",
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  index: function() {
    if (!this.views.hasView('welcome')) {
      var view = new WelcomeView();
      this.views.addView('welcome', view);
    }

    this.views.showView('index');
  }

});

module.exports = Router;
