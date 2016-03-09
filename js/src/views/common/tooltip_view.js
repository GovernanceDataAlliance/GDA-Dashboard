var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var LegendView = Backbone.View.extend({

  // events: {
  //   'click .btn-close-modal' : '_hide'
  // },

  initialize: function() {
    this.model = new (Backbone.Model.extend({
      defaults: {
        isHidden: true
      }
    }));

    this._setListeners();
  },

  _setListeners: function() {
    this.model.on('change:isHidden', this._toggleLegend, this);
  },

  _setEvents: function() {

    var listener = _.bind(function() {
      this._hide();
    }, this);

    if (!this.model.get('isHidden')) {
      document.addEventListener('click', listener);
      $('.pop-up-legend-container').on('click', _.bind(this._stopEvent, this));
    } else {
      document.removeEventListener('click', listener);
    }

    this.$('.btn-close-modal').on('click', _.bind(this._hide, this));
  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _hide: function() {
    if (!this.$el.find('.pop-up-legend-container').hasClass('is-hidden')) {
      this.$el.find('.pop-up-legend-container').addClass('is-hidden');
    }
  },

  toggleStatus: function(e) {
    this._stopEvent(e);

    this.model.set({
      isHidden: !this.model.get('isHidden')
    });
  },

  _toggleLegend: function() {
    this.$el.find('.pop-up-legend-container').toggleClass('is-hidden');
    this._setEvents();
  }

});

module.exports = LegendView;
