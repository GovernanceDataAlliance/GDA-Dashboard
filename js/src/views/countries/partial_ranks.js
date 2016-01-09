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
        rank: rankNumber
      },
      {
        income: income,
        rank: rankNumber
      }
     ]
    */
    var ranks = this.getData(iso, index);
    // console.log(ranks);
    this.$el.html(template());
  },

  getData: function(iso, index) {
    var ranksForIndex = [];
    
    //Getting cohorts for each country.
    this.partialRanks.cohortsForCountry( iso ).done(_.bind(function(cohorts) {

      //When chorts ready, for each cohort, get countries belonged.
      var self = this;
      _.each(cohorts.rows[0], function(n, key, obj) {
        var cohortName = key;
        var cohort = obj[key];

        //For each cohort, for each index, I get countries
        var rank = self.partialRanks.partialRanksForCountry(iso, index, cohortName, cohort).done(function(countries) {
          
          var rankForThisIndex = {};
          
          var actualCountry = _.findWhere(countries.rows, { 'iso': iso });

          rankForThisIndex.cohortName = cohortName;
          rankForThisIndex.indexName = index;
          rankForThisIndex.rank = actualCountry.rank;

          console.log('rankForThisIndex' , rankForThisIndex)
          return rankForThisIndex;
        });

      });

    }, this));

  }

});

module.exports = PartialRanksView;
