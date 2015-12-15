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
    indicatorsTemplate = Handlebars.compile(require('../../templates/countries/compare-indicators.hbs'));
    countryScoresTemplate = Handlebars.compile(require('../../templates/countries/compare-country-scores.hbs'));

var CompareSelectorsView = require('./compare_selectors.js');

var compareStatus = new (Backbone.Model.extend({
      defaults: {}
    }));

var CompareView = Backbone.View.extend({


  initialize: function(options) {
    options = options || {};

    if (options && options.countries != null) {
      this.countryIds = _.uniq(options.countries);
      // this.initializeData();
    };

    this.setListeners();
    this.renderIndicators();
    this.initializeData();
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countryRecived).bind(this));
  },

  //Adam
  // initializeData: function() {
  //   this.countries = new Countries();
  //   this.listenTo(this.countries, 'sync', this.renderCountries);
  //   this.countries.forIds(this.countryIds);

  //   var indicatorScoresCollection = function(id, cb) {
  //     var collection = new IndicatorsScores();
  //     collection.forCountry(id).then(function() { cb(null, collection); });
  //   };

  //   // async.map(this.countryIds, indicatorScoresCollection, this.renderIndicatorsScores.bind(this));
  // },

  initializeData: function() {
    this.indicatorScoresCollection = new IndicatorsScores();
  },

  render: function() {    
    this.$el.html(template());
    this.renderSelectors();
    return this;
  },

  /*
   * Render indicators names
   */
  renderIndicators: function() {
    var indicatorsCollection = new Indicators();

    indicatorsCollection.fetch().done(function(indicators) {
      var indicators = _.sortByOrder(indicators.rows, ['short_name']);
      this.$('.js--comparison-indicators').html(indicatorsTemplate({ 'indicators': indicators }))
    }.bind(this))
  },


  renderCountryScores: function(iso, order) {

    this.indicatorScoresCollection.forCountry(iso).done(function(data) {

      var scores = _.sortByOrder(data.rows, ['short_name']);
      this.$('.js--country-' + order).html(countryScoresTemplate({ 'scores': scores }))

    }.bind(this));

  },  


  //Adam
  // renderIndicatorsScores: function(err, collections) {
  //   if (err) { return; }

  //   var formattedCollections =
  //     IndicatorsPresenter.forComparison(collections);
  //   this.$('.js--comparison-indicators').html(indicatorTemplate({
  //     collections: formattedCollections
  //   }));
  // },


  renderSelectors: function() {
    var selectors = new CompareSelectorsView({ el: '.js--comparison-indicators' });
  },

  setCountries: function(countries) {
    if (countries) {
      this.countryIds = countries;
      this.initializeData();
    };
  },

  countryRecived: function(iso, order) {
    compareStatus.set('country'+order, iso);

    this.renderCountryScores(iso, order);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareView;
