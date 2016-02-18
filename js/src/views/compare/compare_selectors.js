var $ = require('jquery');
global.$ = $; // for chosen.js

var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    chosen = require('chosen-jquery-browserify'),
    enquire = require('enquire.js'),
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
    this.render();
  },

  getData: function() {
    return this.countriesCollection.fetch();
  },

  render: function() {
    this.getData().done(function(countries) {
      var countries = _.sortByOrder(countries.rows, ['name']);
      this.$el.html(template({ 'countries': countries }));

      if (this.countries) {
        this.setRecivedValues();
      };

      if (!this.tablet) {
        this.$('select').chosen();
      }

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
