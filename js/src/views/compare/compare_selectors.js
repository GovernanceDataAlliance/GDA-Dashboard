var $ = require('jquery');
global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  enquire = require('enquire.js'),
  chosen = require('chosen-jquery-browserify'),
  async = require('async');

var CountrySelectorModel = require('../../models/countrySelector.js');

var CountriesCollection = require('../../collections/countries.js');
  yearsCollection = require('../../collections/years.js');

var YearSelectorView = require('../common/year_selector.js');

var template = Handlebars.compile(
  require('../../templates/compare/compare_selectors.hbs'));

var CompareSelectorsView = Backbone.View.extend({

  events: {
    'change .js--compare-selector': 'getCountry',
    'change .js--year-selector' : 'getYear'
  },

  initialize: function() {

    // collections
    this.countriesCollection = new CountriesCollection();
    this.yearsCollection = new yearsCollection();
    this.countriesSelectorCollection = new (Backbone.Collection.extend({
      model: CountrySelectorModel
    }));

    this._initCollection();

    this._setView();

    this._setListeners();
  },

  _initCollection: function() {
    var totalCountries = 3;

    this.countriesSelectorCollection.reset();

    for (var i = 1; i <= totalCountries; i++) {
      this.countriesSelectorCollection.add(
        new CountrySelectorModel().set({
          order: i
        }, {silent: true})
      );
    }
  },

  _setView: function() {
    enquire.register("screen and (min-width:768px) and (max-width: 1024px)", {
      match: _.bind(function(){
        this.tablet = true;
      },this)
    });

    enquire.register("screen and (min-width:1025px)", {
      match: _.bind(function(){
        this.tablet = false;
      },this)
    });
  },

  _setListeners: function() {

    this.listenTo(this.countriesSelectorCollection, 'change', function() {
      Backbone.Events.trigger('router:update', this.countriesSelectorCollection);
    });
  },

  setParams: function(params) {

    this._initCollection();

    _.each(params, function(d, i) {
      var data = d.split(':');

      this.countriesSelectorCollection.at(i).set({
        iso: data[0],
        year: Number(data[1])
      });
    }.bind(this));

  },

  _setNewCountry: function() {

    var selectors = $('.js--compare-selector');

    $.each(selectors, function(i, selector) {

      if (this.countriesSelectorCollection.at(Number(i)).get('iso')) {

        var countryModel = this.countriesSelectorCollection.at(Number(i)),
          iso = countryModel.get('iso');

        $(selector).val(iso).trigger('liszt:updated');
      }

    }.bind(this));

    return this;
  },

  render: function() {
    this.countriesCollection.fetch().done(function() {

      this.$el.html(template({
        countries: this.countriesCollection.toJSON()
      }));


      if (!this.tablet) {
        this.$('select').chosen();
      }

      this._populateYearSelectors();
      this._setNewCountry();

      this.delegateEvents();

      return this;

    }.bind(this));

    return this;
  },

  _populateYearSelectors: function() {

    this.yearsCollection.getYears().done(function() {

      var selectors = $('.js--year-selector-compare');

      $.each(selectors, function(i, selector) {

        if (!this.countriesSelectorCollection.at(Number(i)).get('year')) {

          this.countriesSelectorCollection.at(Number(i)).set({
            year: this.yearsCollection.getLastYear()
          }, {silent: true});

        }

        new YearSelectorView({
          actualYear: this.countriesSelectorCollection.at(Number(i)).get('year'),
          el: $(selector),
          index: Number(i) + 1,
          years: this.yearsCollection.toJSON()
        });

      }.bind(this));

    }.bind(this));
  },

  getCountry: function(e) {
    e && e.preventDefault();
    var selectedCountry = $(e.currentTarget).val();
      order = $(e.currentTarget).attr('id').split('-')[1];

    this.countriesSelectorCollection.at(order - 1).set('iso', selectedCountry);
  },

  getYear: function(e) {
    e && e.preventDefault();
    var selectedYear = $(e.currentTarget).val();
      order = $(e.currentTarget).attr('id').split('-')[1];

    this.countriesSelectorCollection.at(order - 1).set('year', selectedYear);
  },

  getCollection: function() {
    return this.countriesSelectorCollection;
  },

  show: function() {},
  hide: function() {}

});

module.exports = CompareSelectorsView;
