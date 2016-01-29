var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');


var LegendView = Backbone.View.extend({

  events: {
    'click #legendPopup' : '_toggleLegend',
    'click .btn-info' : '_stopEvent'
  },

  initialize: function() {
    this._setListeners();
  },

  _setListeners: function() {
    $('html').on('click', _.bind(function() {
      this._hide();
    }, this));
  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _hide: function() {
    if (!this.$el.find('.pop-up-legend').hasClass('is-hidden')) {
      this.$el.find('.pop-up-legend').addClass('is-hidden');
    }
  },

  _toggleLegend: function(e) {
    this._stopEvent(e);
    this.$el.find('.pop-up-legend').toggleClass('is-hidden');
  }

});

module.exports = LegendView;
