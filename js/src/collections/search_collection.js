var _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/countries_rank.sql.hbs'));

var SearchCollection = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.country_table_name,
  columns: ['iso3', 'region_name', 'name'],

  url: function() {
    // Ignore countries without a valid region ID
    var whereClause = "WHERE region > 0";

    var query = [this._getQuery(), whereClause].join(" ");
    
    return this._urlForQuery(query);
  }

});

module.exports = SearchCollection;
