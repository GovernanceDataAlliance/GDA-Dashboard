var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Indicator = require('../../models/indicator.js'),
    Countries = require('../../collections/countries.js');

var IndicatorHeaderView = require('./indicator_header.js'),
    CountryListView = require('./country_list.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator.hbs'));

var IndicatorView = Backbone.View.extend({
  events: {
    "click .js--download": "download"
  },

  initialize: function(options) {
    options = options || {};

    this.id = options.id;
    this.initializeData();
  },

  initializeData: function() {
    this.indicator = new Indicator({id: this.id});
    this.listenTo(this.indicator, 'sync', this.renderIndicator);
    this.indicator.fetch();

    this.countries = new Countries();
    this.listenTo(this.countries, 'sync', this.renderCountries);
    this.countries.withRankForIndicator(this.id);
  },

  render: function(rerender) {
    this.$el.html(template());

    if (rerender === true) {
      this.renderIndicator();
      this.renderCountries();
    }
  },

  renderCountries: function() {
    var listView = new CountryListView({
      countries: this.countries});
    this.$('.js--countries').append(listView.render().el);
  },

  renderIndicator: function() {
    var headerView = new IndicatorHeaderView({
      indicator: this.indicator});
    this.$('.js--indicator-header').append(headerView.render().el);
  },

  download: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var url = this.countries.downloadRanksForIndicator(this.id);
    window.location = url;
  },

  setIndicator: function(id) {
    if (this.id === id) { this.render(true); }

    this.stopListening(this.countries);
    this.stopListening(this.indicator);

    this.id = id;
    this.initializeData();
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorView;
