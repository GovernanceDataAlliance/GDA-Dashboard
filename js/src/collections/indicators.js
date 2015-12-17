var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/indicators.sql.hbs'));

var Indicators = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  forCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query);
    var rawData =  this.fetch({url: url});

    // this.parseData(rawData);

    return rawData;
  },

  //TODO - Parse data to have no data when no score for a country for a given country. If this is not possible in queries
  // parseData: function(rawData) {
  //   console.log(rawData.rows)
  // },

  downloadForCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query) + '&format=csv';
    return url;
  }
});

module.exports = Indicators;
