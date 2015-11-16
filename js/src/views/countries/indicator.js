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
    console.log(this.indicator.toJSON());
    this.$el.html(template(this.indicator.toJSON()));
    return this;
  }
});

module.exports = IndicatorView;
