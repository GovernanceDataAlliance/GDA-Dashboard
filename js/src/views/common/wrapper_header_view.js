var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var WrapperHeaderView = Backbone.View.extend({

  el: '.menus-wrapper',

  initialize: function() {
    this._setListeners();
  },

  _setListeners: function() {
    $('html').on('click', _.bind(this._hide, this));
    // $('html').on('touchstart', _.bind(this._hide, this))

    $('.btn-mobile-menu').on('click', _.bind(this._stopPropagation, this));
    // $('.btn-mobile-menu').on('touchstart', _.bind(this._stopPropagation, this));
  },

  _hide: function() {
    this._resetScroll();
    this.$el.removeClass('is-open');
  },

  _stopPropagation: function(e) {
    e.stopPropagation();
    this.$el.addClass('is-open');
    this._avoidScroll();
  },

  _avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
    $('.cover').removeClass('is-hidden');
  },

  _resetScroll: function() {
    $('html').removeClass('is-inmobile');
    $('body').removeClass('is-inmobile');
    $('.cover').addClass('is-hidden');
  }

});

module.exports = WrapperHeaderView;
