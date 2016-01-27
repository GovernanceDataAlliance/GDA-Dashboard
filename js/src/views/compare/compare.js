var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    async = require('async'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js'),
    Years = require('../../collections/years.js'),
    IndicatorsNames = require('../../collections/indicator_configs.js'),
    Indicators = require('../../collections/indicators.js');

var IndicatorsPresenter = require('../../presenters/indicators.js');
    CountriesPresenter = require('../../presenters/countries.js');

var IndicatorService = require('../../lib/services/indicator.js');

var FunctionHelper = require('../../helpers/functions.js')

var template = Handlebars.compile(require('../../templates/compare/compare.hbs')),
    indicatorsTemplate = Handlebars.compile(require('../../templates/compare/compare-indicators.hbs'));
    countryScoresTemplate = Handlebars.compile(require('../../templates/compare/compare-country-scores.hbs'));

var CompareSelectorsView = require('./compare_selectors.js'),
    YearSelectorView = require('../common/year_selector.js'),
    ModalWindowView = require('../common/infowindow_view.js'),
    ToolbarUtilsView = require('../common/toolbar_utils_view.js'),
    LegendView = require('../common/legend_view.js'),
    WrapperHeaderView = require('../common/wrapper_header_view.js');

var compareStatus = new (Backbone.Model.extend({
      defaults: {
        countries: {}
      }
    }));

var CompareView = Backbone.View.extend({

  events: {
    'click .btn-info': 'showModalWindow'
  },

  initialize: function(options) {
    options = options || {};

    this.setListeners();

    new WrapperHeaderView();

    if (options && options.countries != null) {
      this.countryIds = _.uniq(options.countries);
    };

    this.setParams(options.countries, options.year);
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countryRecived).bind(this));
    Backbone.Events.on('year:selected', (this.yearRecived).bind(this));
    Backbone.Events.on('breakpoints:loaded', this._onScroll.bind(this));
  },

  render: function() {
    this.renderIndicators();

    this.$el.html(template());
    this.renderSelectors();
    this.renderToolbar();
    this.calculateLimitPoint();
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
      this.calculateEndScrollPoint();
    }.bind(this))
  },

  calculateEndScrollPoint: function() {
    this.$el.find('.js--compare-toolbar').ready(function() {
      this.breakPoints['endPoint'] = this.$el.find('.js--compare-toolbar').offset().top;
      Backbone.Events.trigger('breakpoints:loaded');
    }.bind(this));
  },

  calculateLimitPoint: function() {
    this.breakPoints = {};

    this.$el.find('.js--compare-selectors').ready(function() {
      this.breakPoints['startPoint'] = this.$el.find('.js--compare-selectors').offset().top;
    }.bind(this));

    this._setScroll();
  },

  _setScroll: function() {
    var debouncedScroll = FunctionHelper.debounce(this._onScroll, 10, true);
    window.addEventListener('scroll', _.bind(debouncedScroll, this));
  },

  _onScroll: function() {
    var $bar = $('.-selectors'),
      $content = $('.l-content'),
      h= $bar.height(),
      posY = window.pageYOffset;

    if(posY >= this.breakPoints['startPoint'] && !$bar.hasClass('-fixed')) {
      $bar.addClass('-fixed');
      $content.addClass('-fixed');
    }

    if (posY >= this.breakPoints['endPoint'] && $bar.hasClass('-fixed')) {
      $bar.addClass('-hide-transition');
    }

    if (posY < this.breakPoints['endPoint'] && $bar.hasClass('-hide-transition')) {
      $bar.removeClass('-hide-transition');
    }

    if (posY > this.breakPoints['startPoint'] + h && posY < this.breakPoints['startPoint'] + h && $bar.hasClass('-fixed') ||
      posY < this.breakPoints['startPoint'] && $bar.hasClass('-fixed')) {
      $bar.removeClass('-fixed');
      $content.removeClass('-fixed');
    }
  },

  renderToolbar: function() {
    this.$el.find('.js--compare-toolbar').find('.wrap').append(new ToolbarUtilsView({
      el: this.$el.find('.js--toolbar-utils')
    }).render().el);

    setTimeout(function() {
      new LegendView({el: '.m-legend'});
    }, 10);
  },

  getDataForCountry: function(iso, order) {
    var indicators = new Indicators();
    indicators.forCountryAndYear(iso, this.year).done(function() {
      this.renderCountryScores(indicators, iso, order)
    }.bind(this));
  },

  renderCountryScores: function(indicators, iso, order) {
    var sortIndicators = _.sortByOrder(indicators.toJSON(), ['short_name']);
    console.log(sortIndicators);
    this.$('.js--' + order).html(countryScoresTemplate({ 'scores': sortIndicators, 'iso': iso }));
    $('.m-advise').addClass('is-hidden');
  },

  renderSelectors: function() {
    //TODO -- Add view manager.
    this.getYears().done(function(years) {
      var yearSelectors = new YearSelectorView({ el: this.$('.js--year-selector-compare'), 'years': years.rows, 'actualYear': this.year });
    }.bind(this));

    var selectors = new CompareSelectorsView({ el: this.$('.js--compare-selectors'), 'countries': this.countryIds });
  },

  getYears: function() {
    var years = new Years();
    return years.totalYears()
  },

  setParams: function(countries, year) {
     this.countryIds = countries || [];
     this.year = year || (new Date).getFullYear() - 1;
   },

  countryRecived: function(iso, order) {
    var order = 'country-'+ order
    compareStatus.get('countries')[order] = iso;
    this.getDataForCountry(iso, order);
  },

  yearRecived: function(year) {
    compareStatus.set('year', year);
    this.year = year || '2015';

    var countries = compareStatus.get('countries');

    _.each(countries, function(country, order) {
      this.getDataForCountry(country, order);
    }.bind(this))
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
