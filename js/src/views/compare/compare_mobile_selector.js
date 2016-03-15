var $ = require('jquery');
  global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars'),
  chosen = require('chosen-jquery-browserify'),
  async = require('async');

// var CompareSelectorsView = require('./compare_selectors.js');

var CountriesCollection = require('../../collections/countries.js'),
  YearsCollection = require('../../collections/years.js');

var template = Handlebars.compile(
  require('../../templates/compare/selectors/compare_country_selector.hbs'));

var order = 1;

var CountrySelectorView = Backbone.View.extend({

  events: {
    'change .js--compare-selector': '_getCountry',
    'change .js--compare-year' : '_getYear'
  },

  initialize: function(options) {
    options = options || {};

    this.status = new (Backbone.Model.extend({
      defaults: {
        iso: null,
        order: order,
        year: null
      }
    }));

    order +=1;

    // collections
    this.countriesCollection = new CountriesCollection();
    this.yearsCollection = new YearsCollection();

    this._setView();

    this._setListeners();
  },

  _setListeners: function() {
    // this.listenTo(this.status, 'change:iso', this._setCountryValue.bind(this));
  },

  getPromise: function() {
    var deferred = new $.Deferred();

    this.yearsCollection.getYears().done(function(data, p) {
      this.status.set({
        year: this.yearsCollection.getLastYear()
      }, {silent: true});

      deferred.resolve();

    }.bind(this));

    return deferred.promise();
  },

  _setView: function() {
    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
  },

  render: function() {

    $.when(
      this.yearsCollection.getYears(),
      this.countriesCollection.fetch()
    ).done(function() {

      var countries = this.countriesCollection.toJSON(),
        years = this.yearsCollection.toJSON();

      this.$el.html(template({
        countries: countries ,
        index: this.status.get('order'),
        years: years
      }));

      this.delegateEvents();

      if (this.status.get('iso')) {
        this._setCountryValue();
      }

      if (this.status.get('year')) {
        this._setYearValue();
      }

      if (!this.mobile) {
        this.$('select')
          .chosen({ "disable_search": true });
      }

      return this;

    }.bind(this));

    return this;
  },

  _setCountryValue: function() {
    var iso = this.status.get('iso'),
      order = this.status.get('order')
      $selector = $('#selectcountry-' + order);

      $selector.val(iso);
  },

  _setYearValue: function() {
    var year = this.status.get('year'),
      order = this.status.get('order'),
      $selector = $('#selectyear-' + order);

      $selector.val(year);
  },

  _getCountry: function(e) {
    e && e.preventDefault();
    var selectedCountry = $(e.currentTarget).val();

    this.status.set({
      iso: selectedCountry
    });
  },

  _getYear: function(e) {
    e && e.preventDefault();
    var selectedYear = $(e.currentTarget).val();

    this.status.set({
      year: selectedYear
    });
  },

  show: function() {},
  hide: function() {}

});

module.exports = CountrySelectorView;
