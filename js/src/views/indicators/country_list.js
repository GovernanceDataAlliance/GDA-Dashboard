var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/indicators/country_list.hbs'));

var IndicatorListView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.countries = options.countries;
  },

  render: function() {
    this.$el.html(template({
      'countries': this.countries
    }));

    return this;
  }
});

module.exports = IndicatorListView;
