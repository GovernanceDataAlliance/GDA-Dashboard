var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/countries/country_toolbar.hbs'));

var CountryToolbarView = Backbone.View.extend({
  
  className: 'wrap',

  events: {
    'click .btn-layout-dashboard': 'gridLayoutDashboard',
    'click .btn-layout-list': 'gridLayoutList'
  },

  initialize: function() {
  },

  render: function() {
    this.$el.html(template({}));

    return this;
  },

  gridLayoutList: function(e) {
    $('#indicatorsContainer').removeClass('is-dashboard-layout');
  },

  gridLayoutDashboard: function(e) {
    $('#indicatorsContainer').addClass('is-dashboard-layout');
  }
});

module.exports = CountryToolbarView;
