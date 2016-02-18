var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var IndicatorConfigs = require('../../collections/indicator_configs.js');
var IndicatorList = require('./indicator_list.js');

var WrapperHeaderView = require('../common/wrapper_header_view.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators.hbs'));

var IndicatorsView = Backbone.View.extend({

  initialize: function() {

    this.indicators = new IndicatorConfigs();
    new WrapperHeaderView();
    this.listenTo(this.indicators, 'sync', this.render);
  },

  render: function() {
    this.$el.html(template());
    this.renderIndicatorsList();

    return this;
  },

  renderIndicatorsList: function() {
    var listView = new IndicatorList({indicators: this.indicators});
    this.$('.js--indicators').html(listView.render().el);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorsView;
