var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/countries/indicator.hbs'));

var LineChartView = require('../common/line_chart_view.js');
var PartialRanksView = require('./partial_ranks.js');

var IndicatorView = Backbone.View.extend({
  tagName: 'li',
  className : 'm-card',

  initialize: function(options) {
    options = options || {};
    this.indicator = options.indicator.toJSON();
  },

  render: function() {
    this.$el.html(template(this.parseData()));
    this._setColorClass();
    this.analizeValues();
    this.partialRanks();

    if (this.indicator['has_historical_info'] === true) {
      this.drawGraph();
    }

    return this;
  },

  _setColorClass: function() {
    if (!!this.indicator.classColor) {
      this.$el.addClass(this.indicator.classColor);
    }
  },

  partialRanks: function() {
    if (this.indicator.iso != undefined) {    
      var partial_ranks = new PartialRanksView({ 
        'el': this.$('.js--partial-ranks'),
        'iso': this.indicator.iso,
        'index': this.indicator.short_name
      });
    }
  },

  parseData: function() {
    var data = this.indicator;

    if (data.units == 'percent' ) {
      data.units_tpl = '%';
    };

    return data;
  },

  drawGraph: function() {
    var graph = new LineChartView( { 
      el: this.$('.js--graph'), 
      'indicator': this.indicator
    } );
  },

  analizeValues: function() {
    //TODO
    var desiredDirection = this.indicator.desired_direction;
  }
});

module.exports = IndicatorView;
