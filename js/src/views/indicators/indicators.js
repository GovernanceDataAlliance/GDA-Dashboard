var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var IndicatorConfigs = require('../../collections/indicator_configs.js');
var IndicatorList = require('./indicator_list.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators.hbs'));

var IndicatorsView = Backbone.View.extend({

  initialize: function() {
    this.indicatorsData = null;

    // collections
    this.indicators = new IndicatorConfigs();

    this._getIndicators();
  },

  _getIndicators: function() {
    this.indicators.indicatorsForList().done(function(data) {
      this.indicatorsData = data.rows;
      this.renderIndicatorsList();
    }.bind(this))
  },

  renderIndicatorsList: function() {
    var listView = new IndicatorList({
      indicators: this.indicatorsData
    });

    this.$('.js--indicators').html(listView.render().el);
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorsView;
