var $ = require('jquery'),
    Backbone = require('backbone');

var SearchView = require('../common/search_view.js'),
  WrapperHeaderView = require('../common/wrapper_header_view.js');

var WelcomeView = Backbone.View.extend({

  el: '.js-welcome',

  initialize: function(options) {
    options = options || {};
    this.initViews();
  },

  show: function() {
    this.initViews();
  },

  initViews: function() {
    var search = new SearchView({ el: this.$('.js--search')});
    new WrapperHeaderView();
  }

});

module.exports = WelcomeView;
