var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    $ = require('jquery'),
    d3 = require('d3');

var LineChart = require('../../lib/line_chart.js');

var LineChartView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.indicator = options.indicator;
    this.data = options.indicator.data;

    console.log(this.data);

    var graph = new LineChart({
      elem: this.el,
      barWidth: 30,
      barSeparation: 45,
      data: this.data,
      hover: true,
      decimals: 0,
      loader: 'is-loading',
      interpolate: 'cardinal',
      dateFormat: '%Y',
      unit: 'year',
      margin: {
        top: 30,
        right: 40,
        bottom: 40,
        left: 55,
        xaxis: 10,
        tooltip: 2.2
      }
    });
  },

});

module.exports = LineChartView;