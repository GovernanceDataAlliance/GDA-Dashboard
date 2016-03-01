var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/indicators/indicator_list.hbs'));

var IndicatorListView = Backbone.View.extend({

  className: 'l-grid',

  initialize: function(options) {
    options = options || {};
    this.indicators = options.indicators;
    this.listenTo(this.indicators, 'sync', this.render);

    if (this.indicators.length === 0) {
      this.indicators.indicatorsForList();
    }
  },

  render: function() {
    if ($('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').removeClass('is-hidden');
    }

    this.$el.html(template({
      'indicators': this.indicators.toJSON()
    }));

    return this;
  }
});

module.exports = IndicatorListView;
