var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var fs = require('fs');
var SQL = Handlebars.compile(
  fs.readFileSync(__dirname + '/../templates/queries/indicators.sql.hbs', 'utf8'));

var Indicators = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  forCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query);

    return this.fetch({url: url});
  }
});

module.exports = Indicators;
