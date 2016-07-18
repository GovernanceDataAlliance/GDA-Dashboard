var $ = require('jquery'),
  Backbone = require('backbone');

var ShareWindowView = require('../common/share_window_view.js');

var CategorySelector = require('./category_selector.js');

var FunctionHelper = require('../../helpers/functions.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function() {

    this.shareWindowView = new ShareWindowView({
      noDownload: true
    });

    this.FunctionHelper = FunctionHelper;

    if (! !!$('body').hasClass('is-post-page')) {
      this._category();
    };

    this.FunctionHelper.scrollTop();
  },

  _category: function() {
    new CategorySelector({
      el: '#categorySelector'
    });
  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

});

module.exports = BlogView;
