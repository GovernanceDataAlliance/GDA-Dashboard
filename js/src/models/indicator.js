var CartoDBModel = require('../lib/cartodb_model.js');

var CONFIG = require('../../config.json');

var Indicator = CartoDBModel.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_config_table_name,
  id_field: 'short_name',
  columns: ['product_name', 'product_description', 'product_logo', 'units', 'short_name', 'methodology_link', 'organization', 'desired_direction']
});

module.exports = Indicator;
