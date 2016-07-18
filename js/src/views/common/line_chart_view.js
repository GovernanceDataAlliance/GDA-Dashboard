var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),  
  d3 = require('d3');

var LineChart = require('../../lib/line_chart.js');

var LineChartView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.indicator = options.indicator;
    this.data = options.data;

    var graph = new LineChart({
      elem: this.el,
      data: this.data,
      hover: true,
      decimals: 0,
      loader: 'is-loading',
      interpolate: 'linear',
      dateFormat: '%Y',
      unit: '',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 0,
        xaxis: 10,
        tooltip: 2.2
      }
    });
  },

});

module.exports = LineChartView;
