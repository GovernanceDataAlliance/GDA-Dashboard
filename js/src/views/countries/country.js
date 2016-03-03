var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    Indicators = require('../../collections/indicators.js'),
    Years = require('../../collections/years.js');

var FunctionHelper = require('../../helpers/functions.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js'),
    CountryToolbarView = require('./country_toolbar.js'),
    ToolbarUtilsView = require('../common/toolbar_utils_view.js'),
    ModalWindowView = require('../common/infowindow_view.js'),
    TooltipView = require('../common/tooltip_view.js'),
    ShareView = require('../common/share_view.js'),
    YearSelectorView = require('../common/year_selector.js'),
    LegendView = require('../common/legend.js');


var template = Handlebars.compile(
  require('../../templates/countries/country.hbs'));

var CountryView = Backbone.View.extend({

  events: {
    'click #legendPopup': '_toggleTooltip',
    'click .btn-info': 'showModalWindow'
  },

  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    this.iso = options.iso;
    this.currentYear = options.year || (new Date).getFullYear() - 1;

    this.functionHelper = FunctionHelper;

    // Initialize collections
    this.country = new Country({id: this.iso});
    this.indicators = new Indicators();
    this.yearsCollection = new Years();

    $.when(this.yearsCollection.totalYears(),
      this.country.fetch()).done(function() {

      this.initializeData();
      this._setListeners();

    }.bind(this));

  },

  initializeData: function() {
    this.render();

    this.indicators.forCountryAndYear(this.iso, this.currentYear).done(function() {
      this.renderCountry();
    }.bind(this));

  },

  _setListeners: function() {
    Backbone.Events.on('year:selected', this._updateYear, this);
    this.listenTo(this.indicators, 'sync', this.renderIndicators);
  },

  render: function(rerender) {
    if (!$('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').addClass('is-hidden');
    }

    this.$el.html(template());
    this.renderToolbars();
    this.renderYearSelector();
    this.renderLegend();

    if (rerender) {
      this.renderCountry();
      this.renderToolbars();
      this.renderIndicators();
    }

    this._setDownloadYear();
    this.functionHelper.scrollTop();
  },

  _toggleTooltip: function(e) {
    new TooltipView().toggleStatus(e);
  },

  _updateYear: function(year) {
    this.currentYear = year;

    this._updateInfo();
  },

  _updateParams: function(params) {
    this.currentYear = params.year;
    this.iso = params.iso;

    this._updateInfo();
  },

  _updateInfo: function() {

    this.country = new Country({id: this.iso});

    $.when(this.country.fetch(), this.indicators.forCountryAndYear(this.iso, this.currentYear)).done(function() {
      this.render(true);
    }.bind(this));
  },

  _setDownloadYear: function() {
    $('.js--download').attr('data-year', this.currentYear);
  },

  renderYearSelector: function() {
    this.currentYear = this.currentYear ? this.currentYear : this.yearsCollection.getLastYear();

    new YearSelectorView({
      el: this.$('.js--year-selector-country'),
      'years': this.yearsCollection.toJSON(),
      'actualYear': this.currentYear
    });
  },

  renderLegend: function() {
    var legends = this.$('.js--legend');
    _.each(legends, function(legend) {
      new LegendView({ el: legend });
    });
  },

  renderCountry: function() {
    var headerView = new CountryHeaderView({
      country: this.country});

    this.$('.js--country-header').html(headerView.render().el);
  },

  renderToolbars: function() {
    this.$el.find('.js--country-toolbar').find('.wrap').append(new ToolbarUtilsView({
      el: this.$el.find('.js--toolbar-utils'),
      isCountry: true,
      iso: this.iso
    }).render().el);

    this.$el.find('.js--country-toolbar').find('.wrap').append(new CountryToolbarView({
      el: this.$el.find('.js--toolbar-display')
    }).render().el);
  },

  showModalWindow: function(e) {
    var data = $(e.currentTarget).data('info');
    if (!data) {
      return;
    }
    new ModalWindowView().render(data);
  },

  renderIndicators: function() {
    new IndicatorListView({
      'indicators': this.indicators,
      currentYear: this.currentYear
    }).render();
  },

  setCountry: function(iso) {
    if (this.iso === iso) { this.render(true); }

    this.stopListening(this.indicators);
    this.stopListening(this.country);

    this.iso = iso;
    this.initializeData();
  },

  show: function() {
    // this.render();
  }

});

module.exports = CountryView;
