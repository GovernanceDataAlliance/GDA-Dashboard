var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery'),
    async = require('async');

var CountriesCollection = require('../../collections/countries.js');

var template = Handlebars.compile(
  require('../../templates/countries/compare_selectors.hbs'));

var CompareSelectorsView = Backbone.View.extend({

  // el: '.js--compare-selectors',

  events: {
    'change .js--compare-selector': 'getCountry'
  },

  initialize: function(options) {
    options = options || {};

    this.countries = options.countries;

    this.countriesCollection = new CountriesCollection();
    this.getData();
  },

  getData: function() {
    var self = this;

    this.countriesCollection.fetch().done(function(countries) {
      self.render(countries.rows);
    });
  },

  render: function(countries) {
    //I have a problem here with el... async?
    // this.$el.html(template({'countries': countries}));
    // console.log(this.el);
    // console.log(this.$el);

    var countries = _.sortByOrder(countries, ['name']);
    $('.js--compare-selectors').html(template({'countries': countries}));

    //this is due to the 'el' problem.
     this.setEvents();

     if (this.countries) {
      this.setRecivedValues();
     };
  },

  setRecivedValues: function() {
    $.each(this.countries, function(i, country) {
      var currentSelector = $('#country-'+ (i+1))
      currentSelector.val(country);
      currentSelector.trigger('change');

    }.bind(this))
  },

  setEvents: function() {
    $('.js--compare-selector').on('change', this.getCountry);
  },

  getCountry: function(e) {
    e && e.preventDefault();

    var selectedCountry = $(e.currentTarget).val();
    var order = $(e.currentTarget).attr('id').split('-')[1];

    Backbone.Events.trigger('country:selected', selectedCountry, order);
  }
});

module.exports = CompareSelectorsView;
