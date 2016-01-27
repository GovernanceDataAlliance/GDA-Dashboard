var $ = require('jquery'),
    Backbone = require('backbone');

var SearchView = require('../common/search_view.js'),
  WrapperHeaderView = require('../common/wrapper_header_view.js');

var WelcomeView = Backbone.View.extend({

  el: '.js-welcome',

  initialize: function(options) {
    options = options || {};
    this.initViews();
    this._setListeners();

    $('.c-brand').addClass('-inactive');
  },

  show: function() {
    this.initViews();
  },

  _setListeners: function() {
    $('.c-brand').on('click', this._preventLink);
  },

  _preventLink: function(e) {
    if (e) {
      e.preventDefault();
    }
  },

  initViews: function() {
    var search = new SearchView({ el: this.$('.js--search')});
    new WrapperHeaderView();
  }

});

module.exports = WelcomeView;
