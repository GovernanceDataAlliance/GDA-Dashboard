var Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js'),
    Indicators = require('../../collections/indicators.js');

var IndicatorsPresenter = require('../../presenters/indicators.js');

var template = Handlebars.compile(require('../../templates/countries/compare.hbs')),
    headerTemplate = Handlebars.compile(require('../../templates/countries/compare-table-header.hbs')),
    indicatorTemplate = Handlebars.compile(require('../../templates/countries/compare-table-body.hbs'));

var CompareView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.countryIds = options.countries;
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
    this.$('.js--comparison-header').html(headerTemplate({
      countries: this.countries.toJSON()
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

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareView;
