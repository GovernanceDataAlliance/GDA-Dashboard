var $ = require('jquery');
  global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars'),
  chosen = require('chosen-jquery-browserify'),
  async = require('async');

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
  },

  getPromise: function() {
    var deferred = new $.Deferred();

    this.yearsCollection.getYears().done(function(data, p) {
      // this.status.set({
      //   year: this.yearsCollection.getLastYear()
      // }, {silent: true});

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
        countries: countries,
        index: this.status.get('order'),
        years: years
      }));

      this.delegateEvents();

      if (this.status.get('iso')) {
        this._setCountryValue();
      }

      if (this.status.get('year')) {
        this._setYearValue();
      } else {
        $(this.$('select')[1]).attr('disabled', 'disabled');
      }

      if (!this.mobile) {
        this.$('select')
          .chosen({ "disable_search": true });
      }

      return this;

    }.bind(this));

    return this;
  },

  filter: function(filteredYears) {
    var $select = $(this.$el.find('select')[1]),
      currentYear = $select.val();

    this.resetYears();

    _.each(filteredYears, function(year) {

      if (currentYear !== year) {
        $select.find('option[value="' + year + '"]').attr('disabled', 'disabled');
      }

    });
  },

  resetYears: function() {
    var $options = $(this.$('select')[1]).find('option');

    _.each($options, function(option) {
      $(option).removeAttr('disabled');
    });
  },

  checkSelection: function() {
    var year = this.status.get('year'),
      $currentOption = $(this.$('select')[1]).find('option[value="' + year + '"]');

    if ($currentOption.length > 0 && $currentOption.attr('disabled') == 'disabled') {

      $(this.$('select')[1])
        .val('no-data')
        .trigger('change');
    }
  },

  _enableYearSelector: function() {
    var $select = $(this.$('select')[1]);

    $select.removeAttr('disabled');
  },

  _disableYearSelector: function() {
    var $select = $(this.$('select')[1]);

    $select.val('no-data');

    $select.attr('disabled', 'disabled');
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

    if (selectedCountry == 'no_data') {
      this._disableYearSelector();
      this.resetYears();
    } else {
      if ($(this.$('select')[1]).attr('disabled')) {
        this._enableYearSelector();
      }
    }

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
