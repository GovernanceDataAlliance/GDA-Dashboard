var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var PartialRanks = require('../../collections/partial_ranks.js');

var template = Handlebars.compile(
  require('../../templates/countries/partial_ranks.hbs'));

var PartialRanksView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.iso = options.iso;
    this.index = options.index;

    // this.render();

    this.partialRanks = new PartialRanks();

    //Getting cohorts
    this.partialRanks.cohortsForCountry(this.iso).done(_.bind(function(cohorts) {
            
      _.map(cohorts.rows[0], function(n, key, obj) {
        this.getCountriesForCohort( key, obj[key] )
      }.bind(this));
    
    }, this));
  },

  getCountriesForCohort: function(cohortName, cohort) {
    console.log(cohortName, cohort);

    this.partialRanks.partialRanksForCountry(this.iso, this.index, cohortName, cohort).done(function(countries) {
      console.log(countries);
    }.bind(this));
  },

  render: function() {
    this.$el.html(template());
  }
});

module.exports = PartialRanksView;
