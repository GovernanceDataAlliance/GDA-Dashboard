var $ = require('jquery'),
    enquire = require('enquire.js'),
    _ = require('lodash'),
    Backbone = require('backbone');

var SearchView = require('../common/search_view.js'),
    SearchMobileView = require('../common/search_mobile_view.js'),
    WrapperHeaderView = require('../common/wrapper_header_view.js');

var WelcomeView = Backbone.View.extend({

  el: '.welcome',

  initialize: function(options) {
    options = options || {};

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

    new WrapperHeaderView();
  }

});

module.exports = WelcomeView;
