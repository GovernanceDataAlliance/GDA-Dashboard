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
    this.currentScroll = 0;
    var debouncedScroll = FunctionHelper.debounce(this._onScrollMobile, 50, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScrollMobile: function(){
    this.$el.addClass('hide');

    var currentPositon = $('body').scrollTop();
    console.log(currentPositon);

    if (currentPositon > this.currentScroll) {
      console.log('im going down');
    };

    this.currentScroll = currentPositon;
  }

});

module.exports = RetractableMenuView;
