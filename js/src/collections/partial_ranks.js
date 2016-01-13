var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var partialRanksSQL = Handlebars.compile(require('../templates/queries/partial_ranks_for_country.sql.hbs'));

var PartialRanks = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  partialRanksForCountry: function(iso, index, cohort) {
    var query = partialRanksSQL({ 
      'index': index, 
      'cohort': cohort === 'global' ? '' : ', '+cohort,
      'iso': iso
    }),
    url = this._urlForQuery(query);
    return this.fetch({url: url});
  },

  parse: function(rawData) {
    return rawData.rows[0];
  }


});

module.exports = PartialRanks;
