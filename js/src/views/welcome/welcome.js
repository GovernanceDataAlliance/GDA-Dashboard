var $ = require('jquery'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var SearchView = require('../common/search_view.js'),
  SearchMobileView = require('../common/search_mobile_view.js');

var WelcomeView = Backbone.View.extend({

  el: '.welcome',

  events: {
    'click .scroll-down' : '_scrollDown'
  },

  initialize: function() {

    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    this.initViews();
  },

  show: function() {
    this.initViews();
  },

  _preventLink: function(e) {
    if (e) {
      e.preventDefault();
    }
  },

  initViews: function() {
    if (!this.mobile) {
      var search = new SearchView({ el: $('.js--search') });
    } else {
      var searchMobile = new SearchMobileView({ el: $('.js--search') });
    }
  },

  _scrollDown: function() {
    var $banner = $('.l-banner'),
      $header = $('.m-site-navigation'),
      scroll = $header.outerHeight() + $banner.outerHeight();

    $('body').animate(
      {scrollTop: scroll },
    '500', 'swing');
  }

});

module.exports = WelcomeView;
