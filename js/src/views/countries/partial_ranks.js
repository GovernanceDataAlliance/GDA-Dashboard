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
    index = options.index;
    cohorts = options.cohorts;

    this.partialRanks = new PartialRanks();
    this.initializeData(index, cohorts);
  },

  initializeData: function(index, cohorts) {
    //Global rank.
    this.partialRanks.globalRankForCountry(index).done(function(countries) {
      this.getGlobalRank(countries);

      //Partial ranks.
      //Here, to be sure global rank appears first.
      _.each(cohorts, function(n, key, obj) {
        var cohortName = key;
        var cohort = obj[key];

        this.partialRanks.partialRanksForCountry(this.iso, index, cohortName, cohort).done(function(countries) {
          this.getPartialRank(countries, cohortName, cohort);
        }.bind(this))
      }.bind(this));

    }.bind(this));

  },

  getGlobalRank: function(countries) {
    var globalRank = {};
    var actualCountry = _.findWhere(countries.rows, { 'iso': this.iso });

    globalRank.cohortName = 'global';
    globalRank.cohort = 'Global';
    globalRank.indexName = actualCountry.short_name;
    globalRank.rank = actualCountry.rank;

    this.render(globalRank);
  },

  getPartialRank: function(countries, cohortName, cohort) {
    var actualCountry = _.findWhere(countries.rows, { 'iso': this.iso });
    var rankForThisCohort = {};

    rankForThisCohort.cohortName = cohortName;
    rankForThisCohort.cohort = cohort;
    rankForThisCohort.indexName = actualCountry.short_name;
    rankForThisCohort.rank = actualCountry.rank;

    this.render(rankForThisCohort);
  },

  render: function(rankForThisCohort) {
    this.$('.partial-scores').append(template({'rank': rankForThisCohort}));
  },

  
});

module.exports = PartialRanksView;
