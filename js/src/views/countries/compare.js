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

var defaultScores = [
  { 'short_name': 'corruption_perceptions_index', 'score': 'no data'  }, 
  { 'short_name': 'doing_business', 'score': 'no data'  }, 
  { 'short_name': 'doing_business_DTF', 'score': 'no data'  }, 
  { 'short_name': 'environmental_democracy_index', 'score': 'no data'  }, 
  { 'short_name': 'freedom_in_the_world', 'score': 'no data'  }, 
  { 'short_name': 'freedom_of_the_press', 'score': 'no data'  }, 
  { 'short_name': 'freedom_on_the_net', 'score': 'no data'  }, 
  { 'short_name': 'global_integrity_report', 'score': 'no data'  }, 
  { 'short_name': 'irm_action_plan_count_star', 'score': 'no data'  }, 
  { 'short_name': 'irm_action_plan_percent_star', 'score': 'no data'  }, 
  { 'short_name': 'nations_in_transit', 'score': 'no data'  }, 
  { 'short_name': 'ogp_regular_consult_forum', 'score': 'no data'  }, 
  { 'short_name': 'resource_governance_index', 'score': 'no data'  }, 
  { 'short_name': 'rti_rating', 'score': 'no data' }
];

var CompareView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.setListeners();

    if (options && options.countries != null) {
      this.countryIds = _.uniq(options.countries);
    };
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countryRecived).bind(this));
  },

  initializeData: function() {
    this.indicatorScoresCollection = new IndicatorsScores();
  },

  render: function() {   
    this.renderIndicators();
    this.initializeData();

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

      $.each(defaultScores, function(i, d) {
        var current = _.findWhere(data.rows, {'short_name': d.short_name});
        console.log(current);

        if (!current) {
          data.rows.push(d);
        }

        console.log(data.rows);
        return data.rows;
      });

      var scores = _.sortByOrder(data.rows, ['short_name']);

      this.$('.js--country-' + order).html(countryScoresTemplate({ 'scores': scores, 'iso': iso }))
    }.bind(this));
  },  

  renderSelectors: function() {
    var selectors = new CompareSelectorsView({ el: this.$('.js--compare-selectors'), countries: this.countryIds });
  },

  setCountries: function(countries) {
     this.countryIds = countries;
     this.initializeData();
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
