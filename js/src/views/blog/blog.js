var $ = require('jquery'),
  Backbone = require('backbone');

var ShareView = require('../common/share_view.js'),
  WrapperHeaderView = require('../common/wrapper_header_view.js');

var CategorySelector = require('./category_selector.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click .js--share': '_share'
  },

  initialize: function() {
    new WrapperHeaderView();
    this.share = new ShareView();
    this._category();
  },

  _category: function() {
    new CategorySelector({
      el: '#categorySelector'
    });
  },

  _share: function() {
    this.share.show();
    this.share._avoidScroll();
  }

});

module.exports = BlogView;
