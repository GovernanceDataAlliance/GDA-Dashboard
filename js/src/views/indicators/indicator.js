var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Indicator = require('../../models/indicator.js'),
    Countries = require('../../collections/countries.js');

var Years = require('../../collections/years.js');

var IndicatorHeaderView = require('./indicator_header.js'),
  IndicatorSelectorsToolbarView = require('./indicator_selectors_toolbar.js'),
  CountryListView = require('./country_list.js'),
  ToolbarUtilsView = require('../common/toolbar_utils_view.js'),
  TooltipView = require('../common/tooltip_view.js');

var TextShortener = require('../common/text_shortener.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator.hbs'));

var IndicatorView = Backbone.View.extend({

  events: {
    "click .js--ranking-groups": "_stopEvent",
    'click .js--btn-ranking': "_stopEvent",
    'click #legendPopup': '_toggleTooltip'
  },

  initialize: function(options) {
    options = options || {};

    this.id = options.id;
    this.givenYear = options.year || null;

    this.initializeData();
    this.setListeners();
  },

  setListeners: function() {
    Backbone.Events.on('rankGroup:chosen', _.bind(this.updateCountries, this));
    Backbone.Events.on('year:selected', _.bind(this.updateCountries, this));

    $('html').click(this._hideRanking);
  },

  initializeData: function() {
    this.getYears().done(function(years) {

      this.years = years ? years.rows : null;
      this.actualYear = years  && years.rows[0] ? years.rows[0].year : null;

      if (this.givenYear) {
        this.actualYear = this.givenYear;
      }

      this.indicator = new Indicator({id: this.id});
      this.listenTo(this.indicator, 'sync', this.renderHeader);
      this.listenTo(this.indicator, 'sync', this.renderSelectorsToolbar);
      this.indicator.fetch();

      this.countries = new Countries();
      this.updateCountries(this.actualYear);

    }.bind(this));

  },

  _stopEvent: function(e) {
    e.stopPropagation();
  },

  _hideRanking: function() {
    $('.js--ranking-groups').addClass('is-hidden');
  },

  getYears: function() {
    var years = new Years();
    return years.totalYearsForThisIndex( this.id );
  },

  _toggleTooltip: function(e) {
    new TooltipView().toggleStatus(e);
  },

  render: function(rerender) {
    if (!$('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').addClass('is-hidden')
    }

    this.$el.html(template());

    if (rerender) {
      this.renderHeader();
      this.renderSelectorsToolbar();
      this.renderCountriesList();
    }
  },

  renderHeader: function() {
    var headerView = new IndicatorHeaderView({
      'indicator': this.indicator});
    this.$('.js--indicator-header').append(headerView.render().el);

    new TextShortener({ el: this.el });
  },

  renderToolbar: function() {
    this.$el.find('.l-toolbar').first().find('.m-control').first().append(new ToolbarUtilsView({
      el: this.$el.find('.js--toolbar-utils')
    }).render().el);

    setTimeout(function() {
      new TooltipView({el: '.m-legend'});
    }, 10);
  },

  renderSelectorsToolbar: function() {
    var toolbarView = new IndicatorSelectorsToolbarView({
      'indicator': this.indicator,
      'years': this.years,
      'actualYear': this.actualYear
    });
    this.$('.js--indicator-toolbar').append(toolbarView.render().el);

    this.renderToolbar();

    $('.js--download').attr('data-indicator-id', this.id);
    $('.js--download').attr('data-year', this.actualYear);
  },

  renderCountriesList: function() {
    var direction = this.indicator.get('desired_direction');
    new CountryListView({
      el: this.$('.js--countries'),
      'countries': this.countries.toJSON(),
      'direction': direction
    });
  },

  download: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var url = this.countries.downloadCountriesForIndicator(this.id);
    window.location = url;
  },

  setIndicator: function(id, year) {
    if (this.id === id) { this.render(true); }

    this.stopListening(this.countries);
    this.stopListening(this.indicator);

    this.id = id;
    this.givenYear = year || null;
    this.initializeData();
  },

  _updateDownload: function() {
    var $downloadBtn = $('.js--download');

    $downloadBtn.attr('data-year', this.actualYear);
    $downloadBtn.attr('data-category-name', this.categoryName);
    $downloadBtn.attr('data-category-group', this.categoryGroup);
  },

  //Update countries when year or category selected.
  updateCountries: function(year, categoryGroup, categoryName) {
    this.actualYear = year || this.actualYear;
    this.categoryName = categoryName || this.categoryName;
    this.categoryGroup = categoryGroup || this.categoryGroup;

    this.countries.countriesForIndicator(this.id, this.actualYear, this.categoryGroup, this.categoryName).done(function() {
      this.renderCountriesList();
    }.bind(this))

    this._updateDownload();
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorView;
