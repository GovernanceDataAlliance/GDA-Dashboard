var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('lodash');

var MainView = Backbone.View.extend({

  el: '.l-main-container',

  events: {
    'click .js--open-menu' : 'handleMenu',
    'click .js--close-menu' : 'handleMenu'
  },
  
  initialize: function() {
    this.cacheVars();
  },

  cacheVars: function() {
    this.$body = $('body');
    this.$html = $('html');
    this.$menuWrap = $('.menus-wrapper');
  },

  handleMenu: function() {
    this.$menuWrap.toggleClass('is-open');
    this.$body.toggleClass('is-inmobile');
    this.$html.toggleClass('is-inmobile');
  }
});

module.exports = MainView;

var main = new MainView();