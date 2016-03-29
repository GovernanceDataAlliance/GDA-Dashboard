var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  enquire = require('enquire.js');

var tpl = Handlebars.compile(
  require('../../templates/common/mobile_menu_tpl.hbs'));

var WrapperHeaderView = Backbone.View.extend({

  el: '.l-menus',

  initialize: function() {

    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
        this.render();
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
        this.$el.removeClass('is-open');
      },this)
    });

    this.cacheVars();
    this._setListeners();
  },

  cacheVars: function() {
    this.$background = $('.menu-background');
    this.$menu = $('.m-mobile-menu');
    this.$btnClose = $('.btn-close');
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
    this.$menu.removeClass('is-open');
    this.$background.removeClass('is-open');
  },

  _openMenu: function(e) {
    e.stopPropagation();
    this.$menu.addClass('is-open');
    this.$background.addClass('is-open');
    this._avoidScroll();
  },

  _avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
  },

  _resetScroll: function() {
    $('html').removeClass('is-inmobile');
    $('body').removeClass('is-inmobile');
  },

  render: function() {
    $('body').append(tpl());
  }

});

module.exports = WrapperHeaderView;
