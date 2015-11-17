var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator_list.hbs'));

var IndicatorListView = Backbone.View.extend({
  
  initialize: function(options) {
    options = options || {};
    this.indicators = options.indicators;
    this.listenTo(this.indicators, 'sync', this.render);

    if (this.indicators.length === 0) {
      this.indicators.fetch();
    }
  },

  render: function() {
    this.$el.html(template({
      indicators: this.indicators.toJSON()
    }));

    return this;
  }
});

module.exports = IndicatorListView;
