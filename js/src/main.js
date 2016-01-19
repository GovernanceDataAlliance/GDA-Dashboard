var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

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
    this.$menuWrap = $('.menus-wrapper');
  },

  handleMenu: function() {
    this.$menuWrap.toggleClass('is-open');
  }
});

module.exports = MainView;

var main = new MainView();