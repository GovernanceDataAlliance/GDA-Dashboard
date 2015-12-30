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

  renderCountryScores: function(indicators) {
    this.indicators = IndicatorService.groupById(indicators);
    var sortIndicators = _.sortByOrder(this.indicators.toJSON(), ['short_name']);
    this.$('.js--country-' + this.order).html(countryScoresTemplate({ 'scores': sortIndicators, 'iso': this.iso }));
  },

  getDataForCountry: function() {
    this.indicators = new Indicators();
    this.listenTo(this.indicators, 'sync', this.renderCountryScores);
    this.indicators.forCountry(this.iso);
  },

  renderSelectors: function() {
    //TODO -- Add view manager.
    var selectors = new CompareSelectorsView({ el: this.$('.js--compare-selectors'), countries: this.countryIds });
  },

  setCountries: function(countries) {
     this.countryIds = countries;
     this.initializeData();
   },

  countryRecived: function(iso, order) {
    console.log(iso, order)
    compareStatus.set('country'+ order, iso);

    this.iso = iso;
    this.order = order;

    this.getDataForCountry();
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
