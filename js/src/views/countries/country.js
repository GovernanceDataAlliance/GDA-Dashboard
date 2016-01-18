var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    Indicators = require('../../collections/indicators.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js'),
    CountryToolbarView = require('./country_toolbar.js'),
    ToolbarUtilsView = require('../common/toolbar_utils_view.js');

var ShareView = require('../common/share_view.js');

var template = Handlebars.compile(
  require('../../templates/countries/country.hbs'));

var CountryView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    this.iso = options.iso;
    this.initializeData();

  },

  initializeData: function() {
    this.country = new Country({id: this.iso});
    this.listenTo(this.country, 'sync', this.renderCountry);
    this.country.fetch();

    this.indicators = new Indicators();
    this.listenTo(this.indicators, 'sync', this.renderIndicators);
    this.indicators.forCountry(this.iso);
  },

  render: function(rerender) {
    this.$el.html(template());
    this.renderToolbars();

    if (rerender === true) {
      this.renderCountry();
      this.renderToolbars();
      this.renderIndicators();
    }
  },

  renderCountry: function() {
    var headerView = new CountryHeaderView({
      country: this.country});
    this.$('.js--country-header').append(headerView.render().el);
  },

  renderToolbars: function() {
    this.$el.find('.js--country-toolbar').find('.wrap').append(new ToolbarUtilsView({
      el: this.$el.find('.js--toolbar-utils'),
      isCountry: true,
      iso: this.iso
    }).render().el);

    this.$el.find('.js--country-toolbar').find('.wrap').append(new CountryToolbarView({
      el: this.$el.find('.js--toolbar-display')
    }).render().el);
  },

  renderIndicators: function() {
    var listView = new IndicatorListView({
      'indicators': this.indicators
    });
    listView.render();
  },

  // download: function(event) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   var url = this.indicators.downloadForCountry(this.iso);
  //   window.location = url;
  // },

  setCountry: function(iso) {
    if (this.iso === iso) { this.render(true); }

    this.stopListening(this.indicators);
    this.stopListening(this.country);

    this.iso = iso;
    this.initializeData();
  },

  // share: function() {
  //   var shareWindow = new ShareView();
  //   shareWindow.show();
  // },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountryView;
