var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var indicators = require('../../collections/indicators'),
  countries = require('../../collections/countries');

var infoWindowView = require('./infowindow_view.js');

var tpl = Handlebars.compile(require('../../templates/common/download_tpl.hbs'));

var DownloadView = infoWindowView.extend({

  template: tpl,

  events: {
    'click .js--download-btn': '_getDownload',
    'click .js--cancel-btn': '_cancel'
  },

  initialize: function(settings) {
    var options = settings && settings.options ? settings.options : settings;
    this.options = _.extend({}, options);

    _.extend(this.options, {
      id: window.indicatorId
    });

    if (window.location.pathname == '/countries') {
      _.extend(this.options, {
        iso: window.location.hash.split('&')[0].slice(1)
      });
    }

    this.indicatorsCollection = new indicators();
    this.countriesCollection  = new countries();

    this._setListeners();
  },

  _setListeners: function() {
    Backbone.Events.on('rankGroup:chosen', this._setCohortInfo, this);
    Backbone.Events.on('compare:download-data', this._setDownloadData, this);
    Backbone.Events.on('year:selected', this._setYear, this);
  },

  _setCohortInfo: function() {
    _.extend(this.options, {
      categoryGroup: arguments[0],
      categoryName: arguments[1] ? arguments[1] : 'global'
    });

    if (this.options.categoryName == 'globally') {
      this.options.categoryGroup = null;
    }
  },

  _setDownloadData: function(countries) {
    this.options.compare = countries;
  },

  _setYear: function(year) {
    _.extend(this.options, {
      year: year
    });
  },

  _getCSV: function() {
    if (this.options.id) {
      return this.countriesCollection.downloadCountriesForIndicator(
        this.options.id, this.options.year, this.options.categoryGroup, this.options.categoryName);
    } else if (this.options.compare) {

      if (!this.options.compare.length > 0) {
        return;
      }

      $('.js--download-btn')
        .unbind('click')
        .removeClass('disabled');

      return this.indicatorsCollection.downloadForCountries({
        countries: this.options.compare
      });

    } else {

      return this.indicatorsCollection.downloadForCountry({
        iso: this.options.iso,
        year: this.options.year
      });

    }
  },

  _cancel: function(e) {
    e.preventDefault();
    this.constructor.__super__.close();
  },

  _checkCompareDownload: function() {
    if (window.location.pathname !== '/compare') {
      return;
    }

    if (this.options.compare && this.options.compare.length > 0) {
      $('.js--download-btn')
        .unbind('click')
        .removeClass('-disabled');

    } else {
      $('.js--download-btn').on('click', function(e) {
        e.preventDefault();
      });

      $('.js--download-btn').addClass('-disabled');
    }
  },

  render: function() {
    this.$el.append(this.template({
      csv: this._getCSV(),
      siteURL: SITEURL || null
    }));

    this._checkCompareDownload();
  }

});

module.exports = DownloadView;
