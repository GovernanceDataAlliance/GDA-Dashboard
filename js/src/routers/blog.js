var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  BlogView = require('../views/blog/blog.js');

var Router = Backbone.Router.extend({

  routes: {
    "*actions": "blog"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  blog: function() {
    new BlogView();
  }

});

module.exports = Router;
