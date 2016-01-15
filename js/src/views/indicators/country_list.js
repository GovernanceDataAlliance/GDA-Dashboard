var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/indicators/country_list.hbs'));

var IndicatorListView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.direction = options.direction;
    this.countries = options.countries;

    this.render();
  },

  render: function() {
    //TODO move this to the QUERY.
    var countries = this.direction === 'down' ? this.countries.reverse() : this.countries;
    this.$el.html(template({
      'countries': countries,
      'direction': this.direction
    }));

  }
});

module.exports = IndicatorListView;
