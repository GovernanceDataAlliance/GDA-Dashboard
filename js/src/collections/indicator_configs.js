var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var IndicatorConfigs = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_config_table_name,
});

module.exports = IndicatorConfigs;
