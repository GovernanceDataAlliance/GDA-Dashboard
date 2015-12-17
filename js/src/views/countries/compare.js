var Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    $ = require('jquery');

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

    this.setListeners();
    this.renderIndicators();
    this.initializeData();

    if (options && options.countries != null) {
      this.countryIds = _.uniq(options.countries);

      $.each(this.countryIds, function(i, country) {
        this.countryRecived(country, i+1)
      }.bind(this))
    };

  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countryRecived).bind(this));
  },

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
      this.$('.js--country-' + order).html(countryScoresTemplate({ 'scores': scores, 'iso': iso }))
    }.bind(this));

  },  

  renderSelectors: function() {
    var selectors = new CompareSelectorsView({ el: '.js--comparison-indicators' });
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
