var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var IndicatorView = require('./indicator.js');

var Indicators = require('../../collections/indicators.js'),
    IndicatorService = require('../../lib/services/indicator.js');

var IndicatorListView = Backbone.View.extend({

  tagName: 'ul',
  className : 'l-grid',
  
  initialize: function(options) {
    options = options || {};

    this.indicators = IndicatorService.groupById(options.indicators);
  },

  render: function() {
    this.indicators.each(function(indicator) {
      var indicatorView = new IndicatorView({
        indicator: indicator});
      this.$el.append(indicatorView.render().el);
    }.bind(this));
    
    return this;
  }
});

module.exports = IndicatorListView;
