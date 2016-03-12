var $ = require('jquery');
global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  enquire = require('enquire.js'),
  chosen = require('chosen-jquery-browserify'),
  async = require('async');

var CountriesCollection = require('../../collections/countries.js');
  yearsCollection = require('../../collections/years.js');

var YearSelectorView = require('../common/year_selector.js');

var template = Handlebars.compile(
  require('../../templates/compare/compare_selectors.hbs'));

var CompareSelectorsView = Backbone.View.extend({

  events: {
    'change .js--compare-selector': 'getCountry'
  },

  initialize: function(options) {
    options = options || {};

    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.tablet = true;
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.tablet = false;
      },this)
    });

    this.countries = options.countries;


    this.countriesCollection = new CountriesCollection();
    this.yearsCollection = new yearsCollection();

    this.render();
  },

  getData: function() {
    return this.countriesCollection.fetch();
  },

  render: function() {
    this.getData().done(function(countries) {
      var countries = _.sortByOrder(countries.rows, ['name']);
      this.$el.html(template({ 'countries': countries }));

      this.delegateEvents();

      if (this.countries) {
        this.setRecivedValues();
      }

      if (!this.tablet) {
        this.$('select').chosen();

        this._setYearsSelectors();
      }

    }.bind(this));
  },

  _setYearsSelectors: function() {
    this.yearsCollection.getYears().done(function() {
      var selectors = $('.js--year-selector-compare');

      $.each(selectors, function(index, selector) {
        new YearSelectorView({
          actualYear: this.yearsCollection.getLastYear(),
          el: $(selector),
          years: this.yearsCollection.toJSON()
        });
      }.bind(this));

    }.bind(this));
  },

  setRecivedValues: function() {
    $.each(this.countries, function(i, country) {
      var currentSelector = this.$el.find('#country-'+ (i+1));
      currentSelector.val(country).trigger('change');
    }.bind(this));
  },

  getCountry: function(e) {
    e && e.preventDefault();
    var selectedCountry = $(e.currentTarget).val();
    var order = $(e.currentTarget).attr('id').split('-')[1];

    Backbone.Events.trigger('country:selected', selectedCountry, order);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareSelectorsView;
