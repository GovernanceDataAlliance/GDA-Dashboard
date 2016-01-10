var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var partialRanksSQL = Handlebars.compile(require('../templates/queries/partial_ranks_for_country.sql.hbs')),
    globalRankSQL = Handlebars.compile(require('../templates/queries/global_rank_for_country.sql.hbs'));


var PartialRanks = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  partialRanksForCountry: function(iso, index, cohortName, cohort) {
    var query = partialRanksSQL({ 
      'index': index, 
      'cohortName': cohortName,
      'cohort': cohort
    }),
    url = this._urlForQuery(query);
    return this.fetch({url: url});
  },

  globalRankForCountry: function(index) {
    var query = globalRankSQL({ 
      'index': index
    }),
    url = this._urlForQuery(query);
    return this.fetch({url: url});
  },

  parse: function(rawData) {
    return rawData.rows;
  }


});

module.exports = PartialRanks;
