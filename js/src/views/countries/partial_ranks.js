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

    this.iso = options.iso;
    var index = options.index;

    this.partialRanks = new PartialRanks();
    this.initializeData(index);
  },

  initializeData: function(index) {
    var cohorts = ['global', 'region', 'income_group'];

    _.each(cohorts, function(cohort) {
      this.partialRanks.partialRanksForCountry(this.iso, index, cohort).done(function(country) {
        this.render(country.rows[0], cohort);
      }.bind(this))
    }.bind(this));
  },

  render: function(country, cohort) {
    this.$('#'+cohort).append(template({
      'rank': country['rank'],
      'cohort': cohort === 'global' ? 'Global' : country[cohort],
      'index': country['short_name']
    }));
  }
});

module.exports = PartialRanksView;
