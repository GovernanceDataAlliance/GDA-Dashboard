var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var CountriesCollection = require('../../collections/countries.js');

var template = Handlebars.compile(
  require('../../templates/countries/compare_selectors.hbs'));

var CompareSelectorsView = Backbone.View.extend({

  // el: '.js--compare-selectors',

  initialize: function(options) {
    options = options || {};
    this.country = options.country;

    // this.listenTo(this.country, 'sync', this.render);

    this.countriesCollection = new CountriesCollection();
    this.getData();
  },

  getData: function() {
    var self = this;

    this.countriesCollection.fetch().done(function(countries) {
      self.render(countries.rows);
    });
  },

  render: function(countries) {
    //I have a problem here with el... async?
    // this.$el.html(template({'countries': countries}));
    // console.log(this.el);
    // console.log(this.$el);

    console.log(countries)

    $('.js--compare-selectors').html(template({'countries': countries}));
  }
});

module.exports = CompareSelectorsView;
