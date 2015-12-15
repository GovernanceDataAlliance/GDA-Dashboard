var Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars'),
    _ = require('lodash');

var Countries = require('../../collections/countries.js'),
    Indicators = require('../../collections/indicator_configs.js');
    IndicatorsScores = require('../../collections/indicators.js');

var IndicatorsPresenter = require('../../presenters/indicators.js');
    CountriesPresenter = require('../../presenters/countries.js');

var template = Handlebars.compile(require('../../templates/countries/compare.hbs')),
    // headerTemplate = Handlebars.compile(require('../../templates/countries/compare-table-header.hbs')),
    indicatorsTemplate = Handlebars.compile(require('../../templates/countries/compare-indicators.hbs'));

var CompareSelectorsView = require('./compare_selectors.js');

var CompareView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    if (options && options.countries != null) {
      this.countryIds = _.uniq(options.countries);
      this.initializeData();
    };

    this.setListeners();

    this.renderIndicators();
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countryRecived).bind(this));
  },

  initializeData: function() {
    this.countries = new Countries();
    this.listenTo(this.countries, 'sync', this.renderCountries);
    this.countries.forIds(this.countryIds);

    var createIndicatorCollection = function(id, cb) {
      var collection = new IndicatorsScores();
      collection.forCountry(id).then(function() { cb(null, collection); });
    };

    // async.map(this.countryIds, createIndicatorCollection, this.renderIndicators.bind(this));
  },

  render: function() {    
    this.$el.html(template());
    this.renderSelectors();
    return this;
  },

  renderCountries: function() {
    var formattedCountries = CountriesPresenter.forComparison(
      this.countries.toJSON(), this.countryIds);

    // this.$('.js--comparison-header').html(headerTemplate({
    //   countries: formattedCountries
    // }));
  },

  //Adam
  // renderIndicators: function(err, collections) {
  //   if (err) { return; }

  //   var formattedCollections =
  //     IndicatorsPresenter.forComparison(collections);
  //   this.$('.js--comparison-indicators').html(indicatorTemplate({
  //     collections: formattedCollections
  //   }));
  // },

  renderIndicators: function() {
    var indicatorsCollection = new Indicators();
    
    indicatorsCollection.fetch().done(function(indicators) {
      var indicators = _.sortByOrder(indicators.rows, ['short_name']);
      this.$('.js--comparison-indicators').html(indicatorsTemplate({ 'indicators': indicators }))
    }.bind(this))
  },

  renderSelectors: function() {
    var selectors = new CompareSelectorsView({ el: '.js--comparison-indicators' });
  },

  setCountries: function(countries) {
    if (countries) {
      this.countryIds = countries;
      this.initializeData();
    };
  },

  countryRecived: function(countries, order) {
    console.log( countries, order );
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareView;
