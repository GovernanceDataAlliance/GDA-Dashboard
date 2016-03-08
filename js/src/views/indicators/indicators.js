var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var IndicatorConfigs = require('../../collections/indicator_configs.js');
var IndicatorList = require('./indicator_list.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators.hbs'));

var IndicatorsView = Backbone.View.extend({

  initialize: function() {
    this.render();
    this.initializeData();
  },

  initializeData: function(argument) {
    var indicators = new IndicatorConfigs();
    indicators.indicatorsForList().done(function(data) {
      this.renderIndicatorsList(data);
    }.bind(this))
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  renderIndicatorsList: function(data) {
    var listView = new IndicatorList({ indicators: data.rows });
    this.$('.js--indicators').html(listView.render().el);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorsView;
