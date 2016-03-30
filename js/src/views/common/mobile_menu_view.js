var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  enquire = require('enquire.js');

var FunctionHelper = require('../../helpers/functions.js');

var tpl = Handlebars.compile(
  require('../../templates/common/mobile_menu_tpl.hbs'));

var MobileMenuView = Backbone.View.extend({

  el: '.l-header',

  initialize: function() {

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
        this._retractableMenuOn();
        this.render();
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
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

    this.$body = $('body');
    this.$html = $('html');

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
    this.$html.addClass('is-inmobile');
    this.$body.addClass('is-inmobile');
  },

  _resetScroll: function() {
    this.$html.removeClass('is-inmobile');
    this.$body.removeClass('is-inmobile');
  },

  render: function() {
    $('body').append(tpl());
  },

  _retractableMenuOn: function() {
    this.currentScroll = 0;
    var debouncedScroll = FunctionHelper.debounce(this._onScrollMobile, 10, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScrollMobile: function(){
    var currentPositon = window.pageYOffset;

    if (currentPositon < this.$el.height() ) {
      //Show
      this.$el.addClass('show').removeClass('hide');
    } else {
      if (currentPositon < this.currentScroll) {
        //Show
        this.$el.addClass('show').removeClass('hide');
      } else {
        //hide
        this.$el.addClass('hide').removeClass('show');
      }
    }

    this.currentScroll = currentPositon;
  }

});

module.exports = MobileMenuView;
