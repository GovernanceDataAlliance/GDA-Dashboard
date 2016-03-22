var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var FunctionHelper = require('../../helpers/functions.js');

var RetractableMenuView = Backbone.View.extend({

  el: '.l-header',


  initialize: function() {
    this.$el.addClass('is-retractable')
    $('.l-main-container').addClass('-mobile');

    this._retractableMenuOn();
  },

  _retractableMenuOn: function() {
    var debouncedScroll = FunctionHelper.debounce(this._onScrollMobile, 50, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScrollMobile: function(){
    console.log('scroll');
  }

});

module.exports = RetractableMenuView;
