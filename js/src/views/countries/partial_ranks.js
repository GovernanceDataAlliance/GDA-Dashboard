var Backbone = require('backbone'),
    _ = require('lodash'),
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
    this.render(iso, index);
  },


  render: function(iso, index) {
    /*
     * ranks = [
      { 
        region: regionName,
        regionRank: rankNumber
      },
      {
        income: income,
        incomeRank: rankNumber
      }
     ]
    */
    this.getGlobalRank(iso, index);
    this.getPartialRanks(iso, index);
  },

  // TODO get uniques values for index.
  getGlobalRank: function(iso, index) {
    this.partialRanks.globalRankForCountry(index).done(function(countries) {
      var globalRank = {};
      var actualCountry = _.findWhere(countries.rows, { 'iso': iso });

      globalRank.cohortName = 'global';
      globalRank.cohort = 'Global';
      globalRank.indexName = index;
      globalRank.rank = actualCountry.rank;

      this.$('.partial-scores').append(template({'rank': globalRank}));
    }.bind(this));
  },

  getPartialRanks: function(iso, index) {
    //Get cohorts for that country.
    this.partialRanks.cohortsForCountry(iso).done(function(cohorts) {

      //For each cohort, for each index, I get countries belonging
      _.each(cohorts.rows[0], function(n, key, obj) {
        var cohortName = key;
        var cohort = obj[key];

        this.partialRanks.partialRanksForCountry(iso, index, cohortName, cohort).done(function(countries) {

          var rankForThisCohort = {};
          var actualCountry = _.findWhere(countries.rows, { 'iso': iso });

          rankForThisCohort.cohortName = cohortName;
          rankForThisCohort.cohort = cohort;
          rankForThisCohort.indexName = index;
          rankForThisCohort.rank = actualCountry.rank;

          this.$('.partial-scores').append(template({'rank': rankForThisCohort}));

        }.bind(this));

      }.bind(this));

    }.bind(this))
  }

});

module.exports = PartialRanksView;
