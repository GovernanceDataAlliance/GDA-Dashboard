var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');


var template = Handlebars.compile(require('../../templates/common/search_mobile_tpl.hbs'));

var SearchCollection = require('../../collections/countries.js');

var FunctionHelper = require('../../helpers/functions.js');

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

    this.functionHelper = FunctionHelper;

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

  closeSearch: function(e) {
    e && e.preventDefault() && e.stopPropagation();

    this.$('.js--mobile-search').remove();


    this.body.removeClass('is-inmobile');
    this.html.removeClass('is-inmobile');

    this.functionHelper.scrollTop();
  },

  goToCountry: function(e) {
    e && e.preventDefault() && e.stopPropagation();

    window.location.href = SITEURL ?  SITEURL + $(e.currentTarget).val() : $(e.currentTarget).val();

    this.closeSearch();
  }

});

module.exports = SearchMobileView;
