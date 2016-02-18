var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  WelcomeView = require('../views/welcome/welcome.js'),
  WrapperHeaderView = require('../views/common/wrapper_header_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "": "welcome",
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  welcome: function() {
    new WelcomeView();
    new WrapperHeaderView();
  }

});

module.exports = Router;
