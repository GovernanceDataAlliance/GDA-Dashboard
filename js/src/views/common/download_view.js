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

  _setYear: function(year) {
    _.extend(this.options, {
      year: year
    });
  },

  _getCSV: function() {

    if (this.options.id) {
      return this.countriesCollection.downloadCountriesForIndicator(
        this.options.id, this.options.year, this.options.categoryGroup, this.options.categoryName);
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

  render: function() {
    this.$el.append(this.template({
      csv: this._getCSV(),
      siteURL: SITEURL || null
    }));
  }

});

module.exports = DownloadView;
