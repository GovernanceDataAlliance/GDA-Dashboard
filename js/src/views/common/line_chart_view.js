var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');
    $ = require('jquery');

// var LineChart = require('../../lib/line_chart.js');

var LineChartView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    console.log('hola');

    this.data = options.data;

    // var graph = new LineChart();

    // graph.render( {} );
  },

});

module.exports = LineChartView;