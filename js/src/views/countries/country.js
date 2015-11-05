var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    Indicators = require('../../collections/indicators.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js');

var template = Handlebars.compile(
  require('../../templates/countries/country.hbs'));

var CountryView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    this.country = new Country({id: options.iso});
    this.listenTo(this.country, 'sync', this.renderCountry);
    this.country.fetch();

    this.indicators = new Indicators();
    this.listenTo(this.indicators, 'sync', this.renderIndicators);
    this.indicators.forCountry(options.iso);
  },

  render: function() {
    this.$el.html(template());
  },

  renderCountry: function() {
    var headerView = new CountryHeaderView({
      country: this.country});
    this.$('.js--country-header').append(headerView.render().el);
  },

  renderIndicators: function() {
    var listView = new IndicatorListView({
      indicators: this.indicators});
    this.$('.js--indicators').append(listView.render().el);
  },

  show: function() {
    this.render();
  }
});

module.exports = CountryView;
