var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');

var template = Handlebars.compile(require('../../templates/common/search_mobile_tpl.hbs'));

var SearchCollection = require('../../collections/countries.js');

var SearchMobileView = Backbone.View.extend({

  events: {
    'click .js--open-search-mb': 'openSearchBox',
    'click .btn-close-modal' : 'closeSearch',
    'change select': 'goToCountry',
    'touchstart .js--open-search-mb' : 'openSearchBox',
    'touchstart .btn-close-modal' : 'closeSearch'
  },

  initialize: function(settings) {
    this.searchCollection = new SearchCollection();

    this.body = $('body');
    this.html = $('html');
  },

  openSearchBox: function() {
    this.render();
    this.body.addClass('is-inmobile');
    this.html.addClass('is-inmobile');
  },

  render: function() {
    this.searchCollection.fetch().done(function(countries) {
      var orderedCollection = _.sortByOrder(countries.rows, ['name']);
      this.$('.js--search-mobile').html(template({ 'countries': orderedCollection }));
    }.bind(this));
  },

  closeSearch: function() {
    this.$('.js--mobile-search').remove();
    this.body.removeClass('is-inmobile');
    this.html.removeClass('is-inmobile');
  },

  goToCountry: function(e) {
    var country = $(e.currentTarget).val();
    window.location.href = 'countries#' + country;
    this.closeSearch();
  }

});

module.exports = SearchMobileView;
