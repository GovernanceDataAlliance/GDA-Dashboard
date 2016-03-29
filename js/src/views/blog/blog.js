var $ = require('jquery'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var ShareWindowView = require('../common/share_window_view.js'),
    RetractableMenuView = require('../common/retractable_menu_view.js');

var CategorySelector = require('./category_selector.js');

var FunctionHelper = require('../../helpers/functions.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function() {
    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
        this.initViews();
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
        this.initViews();
      },this)
    });

    this.shareWindowView = new ShareWindowView({
      noDownload: true
    });

    this.FunctionHelper = FunctionHelper;

    if (! !!$('body').hasClass('is-post-page')) {
      this._category();
    };

    this.FunctionHelper.scrollTop();
  },

  initViews: function() {
    if (this.mobile) {
      new RetractableMenuView();
    }
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
