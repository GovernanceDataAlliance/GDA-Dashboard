var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/countries/indicator.hbs'));

var IndicatorView = Backbone.View.extend({

  tagName: 'li',
  className : 'm-card',

  initialize: function(options) {
    options = options || {};
    this.indicator = options.indicator;
  },

  render: function() {
    this.$el.html(template(this.parseData()));
    return this;
  },

  parseData: function() {
    var data = this.indicator.toJSON();

    if (data.units == 'percent' ) {
      data.units_tpl = '%';
    };
    
    return data;
  }
});

module.exports = IndicatorView;
