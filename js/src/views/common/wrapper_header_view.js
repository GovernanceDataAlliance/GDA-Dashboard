var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  enquire = require('enquire.js');

var WrapperHeaderView = Backbone.View.extend({

  el: '.menus-wrapper',

  initialize: function() {
    this._setListeners();

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        $('.cover').removeClass('is-hidden');
        $('.menus-wrapper').removeClass('is-open');
      },this)
    });
  },

  _setListeners: function() {
    $('html').on('click', _.bind(this._hide, this));

    $('.btn-mobile-menu').on('click', _.bind(this._stopPropagation, this));
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
    if ($('.menus-wrapper').hasClass('is-open')) {
      $('.cover').addClass('is-hidden');
    };
  }

});

module.exports = WrapperHeaderView;
