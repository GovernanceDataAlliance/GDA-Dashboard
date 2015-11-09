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
  events: {
    "click .js--download": "download"
  },

  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    this.iso = options.iso;
    this.initializeData();
  },

  initializeData: function() {
    this.country = new Country({id: this.iso});
    this.listenTo(this.country, 'sync', this.renderCountry);
    this.country.fetch();

    this.indicators = new Indicators();
    this.listenTo(this.indicators, 'sync', this.renderIndicators);
    this.indicators.forCountry(this.iso);
  },

  render: function(rerender) {
    this.$el.html(template());

    if (rerender === true) {
      this.renderCountry();
      this.renderIndicators();
    }
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

  download: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var url = this.indicators.downloadForCountry(this.iso);
    window.location = url;
  },

  setCountry: function(iso) {
    if (this.iso === iso) { this.render(true); }

    this.stopListening(this.indicators);
    this.stopListening(this.country);

    this.iso = iso;
    this.initializeData();
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountryView;
