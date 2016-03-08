var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/indicators/indicator_list.hbs'));

var IndicatorListView = Backbone.View.extend({

  className: 'l-grid',

  initialize: function(options) {
    options = options || {};
    this.indicators = options.indicators;
  },

  render: function() {
    if ($('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').removeClass('is-hidden');
    }

    this.$el.html(template({
      'indicators': this.indicators
    }));

    return this;
  }
});

module.exports = IndicatorListView;
