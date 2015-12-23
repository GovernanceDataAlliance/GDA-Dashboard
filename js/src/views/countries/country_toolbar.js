var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/countries/country_toolbar.hbs'));

var CountryToolbarView = Backbone.View.extend({

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
    this.activeClass(e);
  },

  gridLayoutDashboard: function(e) {
    $('#indicatorsContainer').addClass('is-dashboard-layout');
    this.activeClass(e);
  },

  activeClass: function(e) {
    $('.js--btn').removeClass('is-active');

    var $target = $(e.currentTarget);
    $target.addClass('is-active');
  }
});

module.exports = CountryToolbarView;
