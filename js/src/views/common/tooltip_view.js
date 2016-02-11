var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');


var LegendView = Backbone.View.extend({

  events: {
    'click .btn-info' : '_toggleStatus'
  },

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
      $('.pop-up-legend').on('click', _.bind(this._stopEvent, this));
    } else {
      document.removeEventListener('click', listener);
    }
  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _hide: function() {
    if (!this.$el.find('.pop-up-legend').hasClass('is-hidden')) {
      this.$el.find('.pop-up-legend').addClass('is-hidden');
    }
  },

  _toggleStatus: function(e) {
    this._stopEvent(e);

    this.model.set({
      isHidden: !this.model.get('isHidden')
    });
  },

  _removeOthersTooltips: function() {
    var othersTooltips = $('.pop-up-legend');

    if (othersTooltips.length > 0) {
      for (var i = 0; i < othersTooltips.length; i++) {
        if (!othersTooltips[i].isEqualNode(this.$el.find('.pop-up-legend')[0])) {
          $(othersTooltips[i]).addClass('is-hidden');
        }
      }
    }
  },

  _toggleLegend: function() {
    this._removeOthersTooltips();

    this.$el.find('.pop-up-legend').toggleClass('is-hidden');
    this._setEvents();
  }

});

module.exports = LegendView;
