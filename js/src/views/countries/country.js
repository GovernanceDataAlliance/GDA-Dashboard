var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    Indicators = require('../../collections/indicators.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js'),
    CountryToolbarView = require('./country_toolbar.js'),
    ToolbarUtilsView = require('../common/toolbar_utils_view.js'),
    ModalWindowView = require('../common/infowindow_view.js'),
    TooltipView = require('../common/tooltip_view.js'),
    WrapperHeaderView = require('../common/wrapper_header_view.js');

var ShareView = require('../common/share_view.js');

var template = Handlebars.compile(
  require('../../templates/countries/country.hbs'));

var CountryView = Backbone.View.extend({

  events: {
    'click #legendPopup': '_toggleTooltip',
    'click .btn-info': 'showModalWindow'
  },

  initialize: function(options) {
    options = options || {};
    if (options.iso === undefined) {
      throw new Error('CountryView requires a Country ISO ID');
    }

    //Think of a better solution...
    $('.js--index-banner').addClass('is-hidden');

    this.iso = options.iso;
    new WrapperHeaderView();
    this.initializeData();
  },

  initializeData: function() {
    this.country = new Country({id: this.iso});
    // this.listenTo(this.country, 'sync', this.renderCountry);
    this.country.fetch().done(function() {
      this.renderCountry();
    }.bind(this));

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

  _toggleTooltip: function(e) {
    new TooltipView().toggleStatus(e);
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

  showModalWindow: function(e) {
    var data = $(e.currentTarget).data('info');
    if (!data) {
      return;
    }
    new ModalWindowView().render(data);
  },

  renderIndicators: function() {
    var listView = new IndicatorListView({
      'indicators': this.indicators
    });
    listView.render();
  },

  setCountry: function(iso) {
    if (this.iso === iso) { this.render(true); }

    this.stopListening(this.indicators);
    this.stopListening(this.country);

    this.iso = iso;
    this.initializeData();
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountryView;
