var Backbone = require('backbone'),
    _ = require('lodash'),
    $ = require('jquery'),
    Handlebars = require('handlebars');

var Indicator = require('../../models/indicator.js'),
    Countries = require('../../collections/countries.js');

var IndicatorHeaderView = require('./indicator_header.js'),
    IndicatorToolbarView = require('./indicator_toolbar.js'),
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
    Backbone.Events.on('rankGroup:chosen', _.bind(this.filterCountries, this))
  },

  initializeData: function() {
    this.indicator = new Indicator({id: this.id});

    this.listenTo(this.indicator, 'sync', this.renderHeader);
    this.listenTo(this.indicator, 'sync', this.renderToolbar);
    this.indicator.fetch();

    this.countries = new Countries();

    this.listenTo(this.countries, 'sync', this.renderCountriesList);
    this.countries.countriesForIndicator(this.id);
  },

  render: function(rerender) {
    this.$el.html(template());

    if (rerender === true) {
      this.renderHeader();
      this.renderToolbar();
      this.renderCountriesList();
    }
  },

  renderHeader: function() {
    var headerView = new IndicatorHeaderView({
      indicator: this.indicator});
    this.$('.js--indicator-header').append(headerView.render().el);
  },

  renderToolbar: function() {
    var toolbarView = new IndicatorToolbarView({
      indicator: this.indicator});
    this.$('.js--indicator-toolbar').append(toolbarView.render().el);
  },

  renderCountriesList: function(mergedCountries) {
    console.log(mergedCountries)
    var countries;

    if (_.isArray(mergedCountries)) {
      countries = mergedCountries;
    } else {
      countries = this.rankPosition(this.countries.toJSON());
    }

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

  filterCountries: function(rankCountries) {
    if (!rankCountries) {
      this.renderCountriesList();
      return;
    }

    var selectedCountries = rankCountries;
    var allCountries = this.countries.toJSON();
    var mergedCountries = [];

    $.each(selectedCountries, function(country) {
      var iso = this.iso;
      var rankData = _.find(allCountries, {'iso': iso});

      if (rankData) {
        mergedCountries.push(rankData);
      }
    })

    mergedCountries = _.sortBy(mergedCountries, 'score').reverse();
    
    var countries = this.rankPosition(mergedCountries);

    this.renderCountriesList(countries);
  },

  //TODO Move this to collection
  rankPosition: function(countries) {
    var groupedByScore;

    //TODO Bug with decimal numbers
    if (this.id === 'environmental_democracy_index') {
      groupedByScore = _.groupBy(_.sortBy(countries, 'score').reverse(), 'score');
    } else if ( this.id === "freedom_in_the_world") {
      groupedByScore = _.sortBy(_.groupBy(countries, 'score'), 'key');
    } else {
      groupedByScore = _.sortBy(_.groupBy(countries, 'score'), 'score').reverse();
    };

    var rank = 1;
    $.each(groupedByScore, function() {
      $.each(this, function() {
        this.rank =  rank;
      })
      return rank ++
    });

    return countries;
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorView;
