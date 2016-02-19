var Handlebars = require('handlebars');
var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var SQL = Handlebars.compile(require('../templates/queries/indicators_config.sql.hbs'));

var IndicatorConfigs = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_config_table_name,

  url: function() {
    var query = SQL({ table: this.table });
    return this._urlForQuery(query);
  },

});

module.exports = IndicatorConfigs;
