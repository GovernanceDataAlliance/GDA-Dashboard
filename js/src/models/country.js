var CartoDBModel = require('../lib/cartodb_model.js');

var CONFIG = require('../../config.json');

var Country = CartoDBModel.extend({
  user_name: CONFIG.cartodb.user_name,
  id_field: 'iso3',
  table: CONFIG.cartodb.country_join,
  columns: ['w.iso3', 'w.name', 'x.income_group', 'x.region']
});

module.exports = Country;
