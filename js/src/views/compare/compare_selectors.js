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

var YearSelectorView = require('../common/year_selector_compare.js');

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

    var totalCountries = 3;

    for (var i = 1; i <= totalCountries; i++) {
      this.countriesSelectorCollection.add(
        new CountrySelectorModel().set({
          order: i
        }, {silent: true})
      );
    }

    this._setView();

    this._setListeners();
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

    Backbone.Events.on('yearsView:loaded', _.bind(this._setFilter, this));
  },

  _setFilter: function() {
    _.each(this.countriesSelectorCollection.toJSON(), function(selector) {

      var selectedCountry = selector.iso;
      var isRepeated = this._checkDuplicatedCountry(selectedCountry);

      if (!isRepeated) {
        return;
      }

      var filteredValues = this._getFilteredValues(selectedCountry);

      this._updateSelectors(filteredValues, selectedCountry);

    }.bind(this));
  },

  _checkDuplicatedCountry: function(isoToCheck) {
    var counter = 0,
      isRepeated = false;

    _.each(this.countriesSelectorCollection.toJSON(), function(model) {
      if (model.iso == isoToCheck) {
        counter++;
      }
    });

    if (counter > 1) {
      isRepeated = !isRepeated;
    }

    return isRepeated;
  },

  _getFilteredValues: function(isoToCheck) {
    var filteredValues = [];

    _.each(this.countriesSelectorCollection.toJSON(), function(model) {
      if (model.iso == isoToCheck) {
        filteredValues.push(Number(model.year));
      }
    });

    return _.uniq(filteredValues);
  },

  setParams: function(params) {

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

        this.countriesSelectorCollection.at(Number(i)).set({
          'yearSelectorView' : new YearSelectorView({
            actualYear: this.countriesSelectorCollection.at(Number(i)).get('year'),
            el: $(selector),
            index: Number(i) + 1,
            years: this.yearsCollection.toJSON()
          }).render()
        });

      }.bind(this));

      Backbone.Events.trigger('yearsView:loaded');

      this._sendDownloadData();

    }.bind(this));
  },

  getCountry: function(e) {
    e && e.preventDefault();
    var selectedCountry = $(e.currentTarget).val();
      order = $(e.currentTarget).attr('id').split('-')[1];

    var countrySelector = this.countriesSelectorCollection.at(order - 1);

    countrySelector.set('iso', selectedCountry);

    if (selectedCountry !== 'no_data') {
      countrySelector.get('yearSelectorView').enableSelector();
    } else {
      countrySelector.get('yearSelectorView').disableSelector();
    }

    var isRepeated = this._checkDuplicatedCountry(selectedCountry);

    if (!isRepeated) {
      countrySelector.get('yearSelectorView').resetYears();
    }

    var filteredValues = this._getFilteredValues(selectedCountry);


    this._updateSelectors(filteredValues, selectedCountry);


    countrySelector.get('yearSelectorView').checkSelection();

    this._sendDownloadData();
  },

  _sendDownloadData: function() {
    var countries = this.countriesSelectorCollection.toJSON(),
      dataCountries = [];

    if (!countries.length > 0) {
      return;
    }

    _.each(countries, function(country) {
      var country = {
        iso: country.iso == 'no_data' ? null : country.iso,
        year: country.year == 'no-data' || !country.iso ? null : country.year
      };

      if (country.iso && country.year) {
        dataCountries.push(country);
      }

    });

    Backbone.Events.trigger('compare:download-data', dataCountries);
  },

  getYear: function(e) {
    e && e.preventDefault();
    var selectedYear = $(e.currentTarget).val();
      order = $(e.currentTarget).attr('id').split('-')[1];

    var countrySelector = this.countriesSelectorCollection.at(order - 1);

    countrySelector.set('year', selectedYear);
    countrySelector.get('yearSelectorView')._setCurrentYear();

    var selectedCountry = countrySelector.get('iso');
    var filteredValues = this._getFilteredValues(selectedCountry);

    this._getFilteredValues(selectedCountry);

    this._updateSelectors(filteredValues, selectedCountry);

    this._sendDownloadData();
  },


  _updateSelectors: function(filteredValues, selectedCountry) {

    _.each(this.countriesSelectorCollection.toJSON(), function(model) {
      var yearSelectorView = model.yearSelectorView;

      if (model.iso == selectedCountry) {
        yearSelectorView.filter(filteredValues);
      } else {
        if (model.iso) {
          yearSelectorView.resetYears();
        }
      }
    });
  },

  getCollection: function() {
    return this.countriesSelectorCollection;
  },

  show: function() {},
  hide: function() {}

});

module.exports = CompareSelectorsView;
