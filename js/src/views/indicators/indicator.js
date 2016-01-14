var Backbone = require('backbone'),
    _ = require('lodash'),
    $ = require('jquery'),
    Handlebars = require('handlebars');

var Indicator = require('../../models/indicator.js'),
    Countries = require('../../collections/countries.js');

var Years = require('../../collections/years.js');


var IndicatorHeaderView = require('./indicator_header.js'),
    IndicatorSelectorsToolbarView = require('./indicator_selectors_toolbar.js'),
    CountryListView = require('./country_list.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator.hbs'));

var IndicatorView = Backbone.View.extend({
  events: {
    "click .js--download": "download"
  },

  initialize: function(options) {
    options = options || {};

    this.id = options.id;
    this.initializeData();
    this.setListeners();
  },

  setListeners: function() {
    Backbone.Events.on('rankGroup:chosen', _.bind(this.updateCountries, this));
    Backbone.Events.on('yearForIndicator:selected', _.bind(this.updateCountries, this));
  },

  initializeData: function() {
    this.getYears().done(function(years) {
      this.years = years.rows;
      this.actualYear = years.rows[0].year
      
      this.indicator = new Indicator({id: this.id});
      this.listenTo(this.indicator, 'sync', this.renderHeader);
      this.listenTo(this.indicator, 'sync', this.renderSelectorsToolbar);
      this.indicator.fetch();

      this.countries = new Countries();
      this.listenTo(this.countries, 'sync', this.renderCountriesList);
      this.countries.countriesForIndicator(this.id, this.actualYear);

    }.bind(this));

  },

  getYears: function() {
    var years = new Years();
    return years.totalYearsForThisIndex( this.id );
  },

  render: function(rerender) {
    this.$el.html(template());

    if (rerender === true) {
      this.renderHeader();
      this.renderSelectorsToolbar();
      this.renderCountriesList();
    }
  },

  renderHeader: function() {
    var headerView = new IndicatorHeaderView({
      indicator: this.indicator});
    this.$('.js--indicator-header').append(headerView.render().el);
  },

  renderSelectorsToolbar: function() {
    var toolbarView = new IndicatorSelectorsToolbarView({
      'indicator': this.indicator, 
      'years': this.years,
      'actualYear': this.actualYear
    });
    this.$('.js--indicator-toolbar').append(toolbarView.render().el);
  },

  renderCountriesList: function(mergedCountries) {
    var countries;

    if (_.isArray(mergedCountries)) {
      countries = mergedCountries;
    } else {
      countries = _.sortBy(this.countries.toJSON(), 'score').reverse();
    }

    countries = _.isEmpty(countries) ? null : countries;

    var listView = new CountryListView({
      'countries': countries});
    this.$('.js--countries').html(listView.render().el);
  },


  download: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var url = this.countries.downloadCountriesForIndicator(this.id);
    window.location = url;
  },

  setIndicator: function(id) {
    if (this.id === id) { this.render(true); }

    this.stopListening(this.countries);
    this.stopListening(this.indicator);

    this.id = id;
    this.initializeData();
  },

  // filterCountries: function(group) {
  //   // console.log(group);
  //   if (!group) {
  //     this.renderCountriesList();
  //     return;
  //   }

  //   console.log(group);
  //   var selectedCountries = group;
  //   var allCountries = this.countries.toJSON();
  //   var mergedCountries = [];

  //   $.each(selectedCountries, function(country) {
  //     var iso = this.iso;
  //     var rankData = _.find(allCountries, {'iso': iso});

  //     if (rankData) {
  //       mergedCountries.push(rankData);
  //     }
  //   })

  //   var countries = _.sortBy(mergedCountries, 'score').reverse();

  //   this.renderCountriesList(countries);
  // },

  //Update countries when year or category selected.
  updateCountries: function(year, categoryGroup, categoryName) {
    this.actualYear = year || this.actualYear;
    this.categoryName = categoryName ||this.categoryName;
    this.categoryGroup = categoryGroup || this.categoryGroup;

    this.countries.countriesForIndicator(this.id, this.actualYear, this.categoryGroup, this.categoryName).done(function(countries) {
      this.renderCountriesList(countries);
    }.bind(this))
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorView;
