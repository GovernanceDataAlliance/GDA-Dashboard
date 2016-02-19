var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/indicators/indicator_header.hbs'));

var IndicatorHeaderView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.indicator = options.indicator;
    this.listenTo(this.indicator, 'sync', this.render);
  },

  render: function() {
    this.$el.html(template({
      'indicator': this.indicator.toJSON()
    }));

    return this;
  }

});

module.exports = IndicatorHeaderView;
