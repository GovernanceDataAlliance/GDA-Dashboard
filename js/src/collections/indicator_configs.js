var Handlebars = require('handlebars');
var _ = require('lodash');
var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var SQL = Handlebars.compile(require('../templates/queries/indicators_config.sql.hbs'));
var list_SQL = Handlebars.compile(require('../templates/queries/indicators_list.sql.hbs'));

var IndicatorConfigs = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_config_table_name,

  url: function() {
    var query = SQL({ table: this.table });
    return this._urlForQuery(query);
  },

  indicatorsForList: function() {
    var query = list_SQL({ table: this.table });
    var url = this._urlForQuery(query);
    return this.fetch({url: url});
  },

  parse: function(data) {
    var ogp = _.find(data.rows, {'short_name': 'ogp_regular_consult_forum'});

    if (ogp['max_score']) {
      ogp['max_score'] = 'yes';
      ogp['min_score'] = 'no';
    }

    return data.rows;
  }

});

module.exports = IndicatorConfigs;
