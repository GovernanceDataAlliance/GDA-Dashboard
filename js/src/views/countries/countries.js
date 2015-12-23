var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js');
var CountryList = require('./country_list.js');

var SearchView = require('../common/search_view.js');

var template = Handlebars.compile(
  require('../../templates/countries/countries.hbs'));

var CountriesView = Backbone.View.extend({
  
  initialize: function(options) {
    options = options || {};
    this.countries = new Countries();
  },

  render: function() {
    this.$el.html(template());
    this.renderCountryList();

    this.initViews();

    return this;
  },

  renderCountryList: function() {
    var listView = new CountryList({countries: this.countries});
    this.$('.js--countries').html(listView.render().el);
  },

  initViews: function() {
    var search = new SearchView({ el: this.$('.js--search') });
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountriesView;
