var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var FunctionHelper = require('../../helpers/functions.js');

var RetractableMenuView = Backbone.View.extend({

  el: '.l-header',

  initialize: function() {
    this.$el.addClass('is-retractable');
    this._retractableMenuOn();
  },

  _retractableMenuOn: function() {
    this.currentScroll = 0;
    var debouncedScroll = FunctionHelper.debounce(this._onScrollMobile, 10, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScrollMobile: function(){
    var currentPositon = window.pageYOffset;

    if (currentPositon > this.$el.height() && currentPositon != 0 ) {
      this.$el.addClass('hide').removeClass('show');
    } else {
      return;
    }

    if (currentPositon < this.currentScroll) {
      this.$el.removeClass('hide').addClass('show');
    };

    this.currentScroll = currentPositon;
  }

});

module.exports = RetractableMenuView;
