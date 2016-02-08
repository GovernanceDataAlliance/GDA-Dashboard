var $ = require('jquery'),
    Backbone = require('backbone');

var ShareView = require('../common/share_view.js');
    CategorySelector = require('./category_selector.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click .js--share': '_share'
  },

  initialize: function(options) {
    options = options || {};
    this._category();
  },

  _category: function() {
    this.category = new CategorySelector({
      el: '#categorySelector'
    });
  },

  _share: function() {
    this.share = new ShareView();
    this.share.show();
    this.share._avoidScroll();
  }

});

module.exports = BlogView;
