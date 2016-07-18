var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  BlogView = require('../views/blog/blog.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "*actions": "blog"
  },

  initialize: function(options) {
    new ViewManager({ $el: options.$el });
    new MobileMenuView();
  },

  blog: function() {
    new BlogView();
  }

});

module.exports = Router;
