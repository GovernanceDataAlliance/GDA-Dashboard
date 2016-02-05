var Backbone = require('backbone'),
    URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
    BlogView = require('../views/blog/blog.js');

var Router = Backbone.Router.extend({

  routes: {
    "": "blog",
    "blog": "blog"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  blog: function() {
    var view = new BlogView({});
  }

});

module.exports = Router;
