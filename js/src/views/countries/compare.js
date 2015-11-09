var Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars'),
    _ = require('lodash');

var Countries = require('../../collections/countries.js'),
    Indicators = require('../../collections/indicators.js');

var IndicatorsPresenter = require('../../presenters/indicators.js');
    CountriesPresenter = require('../../presenters/countries.js');

var template = Handlebars.compile(require('../../templates/countries/compare.hbs')),
    headerTemplate = Handlebars.compile(require('../../templates/countries/compare-table-header.hbs')),
    indicatorTemplate = Handlebars.compile(require('../../templates/countries/compare-table-body.hbs'));

var CompareView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.countryIds = _.uniq(options.countries);
    this.initializeData();
  },

  initializeData: function() {
    this.countries = new Countries();
    this.listenTo(this.countries, 'sync', this.renderCountries);
    this.countries.forIds(this.countryIds);

    var createIndicatorCollection = function(id, cb) {
      var collection = new Indicators();
      collection.forCountry(id).then(function() { cb(null, collection); });
    };
    async.map(this.countryIds, createIndicatorCollection, this.renderIndicators.bind(this));
  },

  render: function() {
    this.$el.html(template());

    return this;
  },

  renderCountries: function() {
    var formattedCountries = CountriesPresenter.forComparison(
      this.countries.toJSON(), this.countryIds);

    this.$('.js--comparison-header').html(headerTemplate({
      countries: formattedCountries
    }));
  },

  renderIndicators: function(err, collections) {
    if (err) { return; }

    var formattedCollections =
      IndicatorsPresenter.forComparison(collections);
    this.$('.js--comparison-indicators').html(indicatorTemplate({
      collections: formattedCollections
    }));
  },

  setCountries: function(countries) {
    this.countryIds = countries;
    this.initializeData();
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareView;
