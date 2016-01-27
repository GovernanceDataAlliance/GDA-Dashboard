var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');


var LegendView = Backbone.View.extend({

  events: {
    'click #legendPopup' : '_toggleLegend',
    'click .btn-info' : '_stopEvent'
  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _toggleLegend: function() {
    this.$el.find('.pop-up-legend').toggleClass('is-hidden');
  }

});

module.exports = LegendView;
