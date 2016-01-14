var $ = require('jquery');
global.$ = $; // for chosen.js

var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    chosen = require('chosen-jquery-browserify'),
    async = require('async');

var CountriesCollection = require('../../collections/countries.js');

var template = Handlebars.compile(
  require('../../templates/compare/compare_selectors.hbs'));

var CompareSelectorsView = Backbone.View.extend({

  events: {
    'change .js--compare-selector': 'getCountry'
  },

  initialize: function(options) {
    options = options || {};

    this.countries = options.countries;

    this.countriesCollection = new CountriesCollection();
    this.render();
  },

  getData: function() {
    return this.countriesCollection.fetch();
  },

  render: function() {
    this.getData().done(function(countries) {
      var countries = _.sortByOrder(countries.rows, ['name']);
      this.$el.html(template({ 'countries': countries }));

      this.$('select').chosen();
      
      if (this.countries) {
        this.setRecivedValues();
      };
    }.bind(this));
  },

  setRecivedValues: function() {
    $.each(this.countries, function(i, country) {
      var currentSelector = this.$el.find('#country-'+ (i+1));
      currentSelector.val(country);
      currentSelector.trigger('change');
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
