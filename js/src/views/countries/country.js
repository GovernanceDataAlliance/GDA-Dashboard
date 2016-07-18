var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    InfoWindowModel = require('../../models/infowindow.js'),
    Indicators = require('../../collections/indicators.js'),
    Years = require('../../collections/years.js');

var FunctionHelper = require('../../helpers/functions.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js'),
    CountryToolbarView = require('./country_toolbar.js'),
    ModalWindowView = require('../common/infowindow_view.js')
    ShareWindowView = require('../common/share_window_view.js'),
    YearSelectorView = require('../common/year_selector.js'),
    LegendView = require('../common/legend.js');


var template = Handlebars.compile(require('../../templates/countries/country.hbs'));

var CountryView = Backbone.View.extend({

  events: {
    'click .btn-info': 'showModalWindow',
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    // Models
    this.infoWindowModel = new InfoWindowModel();

    this.status = new (Backbone.Model.extend({
      defaults: {
        iso: null,
        year: null
      }
    }));

    this.functionHelper = FunctionHelper;

    this.shareWindowView = new ShareWindowView();

    // Initialize collections
    this.country = new Country({id: options.iso});
    this.indicators = new Indicators();
    this.yearsCollection = new Years();

    this.status.set({
      iso: options.iso,
      year: options.year
    });

    this._setListeners();
    this.initializeData();
  },

  initializeData: function() {
    var iso = this.status.get('iso'),
      currentYear = this.status.get('year');

    this.render();

    this.country.fetch();

    this.yearsCollection.getYearsByCountry({iso: iso}).done(function() {

      if (!this.status.get('year')) {
        this.status.set('year', this.yearsCollection.getLastYear())
      } else {
        this.indicators.forCountryAndYear(iso, this.status.get('year'));
      }

      this._updateCompareLink();

    }.bind(this));

  },

  _setListeners: function() {
    // Model listeners
    this.status.on('change:year', _.bind(this._onUpdateYear, this));
    this.status.on('change:iso', _.bind(this.updateCountry, this));

    Backbone.Events.on('year:selected', this._updateYear, this);

    // Collections listeners
    this.listenTo(this.indicators, 'sync', this.renderIndicators);
    this.listenTo(this.country, 'sync', this.renderCountry);
    this.listenTo(this.yearsCollection, 'sync', this.renderYearSelector);
  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  _hideBanner: function() {
    if (!$('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').addClass('is-hidden');
    }
  },

  render: function() {
    this._hideBanner();

    this.$el.html(template());
    this.renderToolbars();
    this.renderLegend();

    this.functionHelper.scrollTop();
  },

  _toggleTooltip: function(e) {
    new TooltipView().toggleStatus(e);
  },

  _updateCompareLink: function() {
    var link = document.querySelector('.l-aside-content a'),
      iso = this.status.get('iso'),
      year = this.status.get('year');

    link.href = '/compare#countries=' + iso + ':' + year;
  },

  updateCountry: function() {
    this.stopListening(this.country);

    this.country.id = this.status.get('iso');
    this.country.fetch();
  },

  _updateYear: function(year) {
    this.status.set('year', year);
  },

  _onUpdateYear: function() {
    // this._setDownloadData();
    this._updateCompareLink();
    this.indicators.forCountryAndYear(this.status.get('iso'), this.status.get('year'));
  },

  _updateParams: function(params) {

    this.yearsCollection.getYearsByCountry({iso: params.iso}).done(function() {

      var lastYear = this.yearsCollection.getLastYear();

      if (params.year == this.status.get('year')) {

        this.status.set({
          iso: params.iso,
          year: params.year ? params.year : lastYear
        });

        this.status.trigger('change:year');

      } else {

        this.status.set({
          iso: params.iso,
          year: params.year ? params.year : lastYear
        });

        if (this.status.get('year') == lastYear) {
          this.status.trigger('change:year');
        }
      }

      this._hideBanner();
      this._updateYearSelector();

      this.countryToolbar.delegateEvents();

    }.bind(this));

  },

  _updateYearSelector: function() {
    var $yearSelector = $('.js--year-selector-country').find('select');
    $yearSelector.val(this.status.get('year'))
    $yearSelector.trigger("liszt:updated");
  },

  renderYearSelector: function() {
    new YearSelectorView({
      el: this.$('.js--year-selector-country'),
      'years': this.yearsCollection.toJSON(),
      'actualYear': this.status.get('year')
    }).render();
  },

  renderLegend: function() {
    var legends = this.$('.js--legend');
    _.each(legends, function(legend) {
      var legendView = new LegendView({ el: legend });
      legendView.delegateEvents();
    });
  },

  renderCountry: function() {
    var headerView = new CountryHeaderView({
      country: this.country
    });

    this.$('.js--country-header').html(headerView.render().el);
  },

  renderToolbars: function() {
    this.countryToolbar = new CountryToolbarView({
      el: this.$el.find('.js--toolbar-display')
    });

    this.$el.find('.js--country-toolbar').find('.wrap').append(this.countryToolbar.render().el);
  },

  _getIndicatorInfo: function(opts) {
    return this.infoWindowModel.getIndicator(opts);
  },

  showModalWindow: function(e) {
    var indicator = $(e.currentTarget).data('indicator');
    if (!indicator) {
      return;
    }

    this._getIndicatorInfo({
      indicator: indicator
    }).done(function() {

      new ModalWindowView({
        'type': 'info-infowindow',
        'data': this.infoWindowModel.toJSON()
      });

    }.bind(this));

  },

  renderIndicators: function() {
    new IndicatorListView({
      'indicators': this.indicators,
      currentYear: this.status.get('year')
    }).render();
  },

  show: function() {}

});

module.exports = CountryView;
