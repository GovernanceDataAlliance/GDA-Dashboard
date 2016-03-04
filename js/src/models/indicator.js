var CartoDBModel = require('../lib/cartodb_model.js');

var CONFIG = require('../../config.json');

var Indicator = CartoDBModel.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_config_table_name,
  id_field: 'short_name',
  columns: ['product_name', 'product_description', 'product_logo', 'units', 'units_abbr', 'short_name', 'methodology_link', 'organization', 'desired_direction', 'max_score']
});

module.exports = Indicator;
