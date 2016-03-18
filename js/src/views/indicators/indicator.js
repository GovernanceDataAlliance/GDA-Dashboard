var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Indicator = require('../../models/indicator.js');

var Countries = require('../../collections/countries.js');
    YearsCollection = require('../../collections/years.js');

var FunctionHelper = require('../../helpers/functions.js');

var IndicatorHeaderView = require('./indicator_header.js'),
  IndicatorSelectorsToolbarView = require('./indicator_selectors_toolbar.js'),
  CountryListView = require('./country_list.js'),
  ShareWindowView = require('../common/share_window_view.js'),
  LegendView = require('../common/legend.js');

var TextShortener = require('../common/text_shortener.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator.hbs'));

var IndicatorView = Backbone.View.extend({

  events: {
    'click .js--ranking-groups': '_stopEvent',
    'click .js--btn-ranking': "_stopEvent",
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function(options) {
    options = options || {};

    window.indicatorId = this.id;

    // models
    this.status = new (Backbone.Model.extend({
      defaults: {
        id: options.id,
        year: options.year,
        categoryGroup: null,
        categoryName: null
      }
    }));

    this.indicator = new Indicator()

    // collections
    this.countries = new Countries();
    this.yearsCollection = new YearsCollection();

    // views
    this.shareWindowView = new ShareWindowView();

    // helper
    this.functionHelper = FunctionHelper;


    // this._initializeData();

    this._setListeners();

    this.indicator.set({
      id: this.status.get('id')
    }).fetch();
  },

  _setListeners: function() {
    this.listenTo(this.indicator, 'sync', _.bind(this._onFetchIndicator, this));

    // this.listenTo(this.status, 'change:id', _.bind(this.renderHeader, this));
    this.listenTo(this.status, 'change', _.bind(this._updateCountries, this));

    Backbone.Events.on('rankGroup:chosen', _.bind(this._onRankChosen, this));
    Backbone.Events.on('year:selected', _.bind(this._onSelectedYear, this));

    $('html').click(this._hideRanking);
  },

  _initializeData: function() {
    var id = this.status.get('id');

    this.renderHeader();

    this.yearsCollection.totalYearsForThisIndex(id).done(function() {

      if (!this.status.get('year')) {
        this.status.set({
          year: this.yearsCollection.getLastYear()
        });
      } else {
        this._updateCountries();
      }

      this.renderSelectorsToolbar();

    }.bind(this));
  },

  _onFetchIndicator: function() {
    this._initializeData();
  },

  _onSelectedYear: function(year) {
    this.status.set({
      year: year
    });

    Backbone.Events.trigger('router:update', {
      id: this.status.get('id'),
      year: this.status.get('year')
    });
  },

  _onRankChosen: function(categoryName, categoryGroup) {
    this.status.set({
      categoryName: categoryName,
      categoryGroup: categoryGroup
    });
  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _hideRanking: function() {
    $('.js--ranking-groups').addClass('is-hidden');
  },

  render: function() {
    if (!$('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').addClass('is-hidden');
    }

    this.$el.html(template());
    this.renderLegend();

    this.functionHelper.scrollTop();
  },

  renderHeader: function() {
    var headerView = new IndicatorHeaderView({
      indicator: this.indicator
    });

    this.$('.js--indicator-header').append(headerView.render().el);

    new TextShortener({ el: this.el });
  },

  renderSelectorsToolbar: function() {
    var toolbarView = new IndicatorSelectorsToolbarView({
      actualYear: this.status.get('year'),
      years: this.yearsCollection.toJSON()
    });

    this.$('.js--indicator-toolbar').append(toolbarView.render().el);
  },

  renderLegend: function() {
    _.each(this.$('.js--legend'), function(legend) {
      var legendView = new LegendView({ el: legend });
      legendView.delegateEvents();
    });
  },

  renderCountriesList: function() {
    new CountryListView({
      el: this.$('.js--countries'),
      countries: this.countries.toJSON(),
      direction: this.indicator.get('desired_direction'),
      max_score: this.indicator.get('max_score')
    });
  },

  update: function(params) {
    this.status.set({
      id: params.id,
      year: params.year
    });

    this.indicator.set({
      id: this.status.get('id')
    }).fetch();
  },

  // updates countries list when year or category  are selected.
  _updateCountries: function() {
      var id = this.status.get('id'),
        year = this.status.get('year'),
        categoryName = this.status.get('categoryName'),
        categoryGroup =  this.status.get('categoryGroup');

    this.countries.countriesForIndicator(id, year, categoryName, categoryGroup).done(function() {
      this.renderCountriesList();
    }.bind(this))
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorView;
