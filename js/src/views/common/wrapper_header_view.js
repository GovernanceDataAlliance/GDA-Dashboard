var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  enquire = require('enquire.js');

var WrapperHeaderView = Backbone.View.extend({

  el: '.l-menus',

  initialize: function() {
    
    enquire.register("screen and (min-width: 768px)", {
      match: _.bind(function(){
        this.$el.removeClass('is-open');
      },this)
    });

    this.cacheVars();
    this._setListeners();
  },

  cacheVars: function() {
    this.$background = this.$('.modal-background');
    this.$menu = this.$('.menus-wrapper');
    this.$btnClose = this.$('.btn-close');
    this$btnOpen = this.$('.btn-mobile-menu');
  },

  _setListeners: function() {
    this$btnOpen.on('click', _.bind(this._openMenu, this));
    this.$btnClose.on('click', _.bind(this._closeMenu, this));
    this.$background.on('click', _.bind(this._closeMenu, this));
  },

  _closeMenu: function(e) {
    this._resetScroll();
    e.stopPropagation();
    this.$el.removeClass('is-open');
  },

  _openMenu: function(e) {
    e.stopPropagation();
    this.$el.addClass('is-open');
    this._avoidScroll();
  },

  _avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
  },

  _resetScroll: function() {
    $('html').removeClass('is-inmobile');
    $('body').removeClass('is-inmobile');
  }

});

module.exports = WrapperHeaderView;
