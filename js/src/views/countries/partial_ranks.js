var Backbone = require('backbone'),
    _ = require('lodash'),
    async = require('async'),
    Handlebars = require('handlebars');

var PartialRanks = require('../../collections/partial_ranks.js');

var template = Handlebars.compile(
  require('../../templates/countries/partial_ranks.hbs'));

var PartialRanksView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    iso = options.iso;
    index = options.index;

    this.partialRanks = new PartialRanks();
    this.initializeData(iso, index);
  },

  initializeData: function(iso, index) {
    this.listenTo(this.partialRanks, 'sync', this.getCountries);
    this.partialRanks.cohortsForCountry(iso);
  },

  getCountries: function(cohorts) {
    console.log(cohorts);

    this.cohorts = cohorts;
  },

  render: function(iso, index) {

  },

  
});

module.exports = PartialRanksView;
