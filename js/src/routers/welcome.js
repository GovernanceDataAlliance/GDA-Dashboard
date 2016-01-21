var Backbone = require('backbone'),
    URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
    WelcomeView = require('../views/welcome/welcome.js');

var Router = Backbone.Router.extend({

  routes: {
    "": "welcome",
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  welcome: function() {
    var view = new WelcomeView({});
  }

});

module.exports = Router;
