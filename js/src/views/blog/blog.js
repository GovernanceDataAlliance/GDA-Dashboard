var $ = require('jquery'),
  Backbone = require('backbone');

var ShareView = require('../common/share_view.js');

var CategorySelector = require('./category_selector.js');

var FunctionHelper = require('../../helpers/functions.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click .js--share': '_share'
  },

  initialize: function() {
    this.share = new ShareView();
    this.FunctionHelper = FunctionHelper;
    this._category();

    this.FunctionHelper.scrollTop();
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
