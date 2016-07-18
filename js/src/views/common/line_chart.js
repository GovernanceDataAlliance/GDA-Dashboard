var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var LineChart = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    this.data = options.data;
  },

});

module.exports = LineChart;
