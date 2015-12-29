var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');
    $ = require('jquery');

var LineChart = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    console.log(this.$el);

    this.data = options.data;
  },

});

module.exports = LineChart;