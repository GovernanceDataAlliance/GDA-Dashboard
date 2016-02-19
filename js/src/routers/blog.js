var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  BlogView = require('../views/blog/blog.js'),
  WrapperHeaderView = require('../views/common/wrapper_header_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "*actions": "blog"
  },

  initialize: function(options) {
    new ViewManager({ $el: options.$el });
    new WrapperHeaderView();
  },

  blog: function() {
    new BlogView();
  }

});

module.exports = Router;
