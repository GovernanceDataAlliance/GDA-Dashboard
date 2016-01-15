var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/cohort_groups.sql.hbs'));

var categories = ["continent", "region_wb", "subregion", "economy"];

var CohortGruops = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.ranking_groups_table_name,

  url: function() {
    var query = SQL({ table: this.table });
    return this._urlForQuery(query);
  },

  getGroups: function() {
    return _.groupBy(this.toJSON(), 'type');
  }

});

module.exports = CohortGruops;
