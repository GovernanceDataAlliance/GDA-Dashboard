var Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    $ = require('jquery');

var Countries = require('../../collections/countries.js'),
    IndicatorsNames = require('../../collections/indicator_configs.js');
    Indicators = require('../../collections/indicators.js');

var IndicatorsPresenter = require('../../presenters/indicators.js');
    CountriesPresenter = require('../../presenters/countries.js');

var IndicatorService = require('../../lib/services/indicator.js');

var template = Handlebars.compile(require('../../templates/countries/compare.hbs')),
    indicatorsTemplate = Handlebars.compile(require('../../templates/countries/compare-indicators.hbs'));
    countryScoresTemplate = Handlebars.compile(require('../../templates/countries/compare-country-scores.hbs'));

var CompareSelectorsView = require('./compare_selectors.js'),
    CompareYearSelectorsView = require('./compare_year_selector.js'),
    ModalWindowView = require('../common/infowindow_view.js')

var compareStatus = new (Backbone.Model.extend({
      defaults: {}
    }));

var CompareView = Backbone.View.extend({

  events: {
    'click .btn-info': 'showModalWindow'
  },

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

  render: function() {   
    this.renderIndicators();

    this.$el.html(template());
    this.renderSelectors();
    return this;
  },

  /*
   * Render indicators names
   */
  renderIndicators: function() {
    var indicatorsNames = new IndicatorsNames();

    indicatorsNames.fetch().done(function(indicators) {
      var indicators = _.sortByOrder(indicators.rows, ['short_name']);
      this.$('.js--comparison-indicators').html(indicatorsTemplate({ 'indicators': indicators }))
    }.bind(this))
  },

  getDataForCountry: function(iso, order) {
    var indicators = new Indicators();
    indicators.forCountry(iso).done(function() {
      this.renderCountryScores(indicators, iso, order)
    }.bind(this));
  },

  renderCountryScores: function(indicators, iso, order) {
    groupedIndicators = IndicatorService.groupScoresById(indicators);
    var sortIndicators = _.sortByOrder(groupedIndicators.toJSON(), ['short_name']);
    this.$('.js--country-' + order).html(countryScoresTemplate({ 'scores': sortIndicators, 'iso': iso }));

    $('.m-advise').addClass('is-hidden');
  },

  renderSelectors: function() {
    //TODO -- Add view manager.

    this.getYears().done(function(years) {
      var yearSelectors = new CompareYearSelectorsView({ el: this.$('.js--year-selector'), 'years': years.rows });
    }.bind(this));

    var selectors = new CompareSelectorsView({ el: this.$('.js--compare-selectors'), 'countries': this.countryIds });
  },

  getYears: function() {
    var indicators = new Indicators();
    return indicators.totalYears()
  },

  setCountries: function(countries) {
     this.countryIds = countries;
   },

  countryRecived: function(iso, order) {
    compareStatus.set('country'+ order, iso);
    this.getDataForCountry(iso, order);
  },

  show: function() {
    this.render();
  },

  hide: function() {},

  showModalWindow: function(e) {
    var data = $(e.currentTarget).data('info');
    var modalWindowView = new ModalWindowView().render(data)
  }
});

module.exports = CompareView;
