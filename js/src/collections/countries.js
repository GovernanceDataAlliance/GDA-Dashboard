var _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/countries_rank.sql.hbs'));

var Countries = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.country_table_name,
  columns: ['iso3', 'region_name', 'name'],

  url: function() {
    // Ignore countries without a valid region ID
    var whereClause = "WHERE region > 0";

    var query = [this._getQuery(), whereClause].join(" ");
    return this._urlForQuery(query);
  },

  forIds: function(ids) {
    var id = [].
      concat(ids).
      map(function(i) { return "'"+i+"'"; }).
      join(", ");
    var whereClause = "AND iso3 IN (" + id + ")";

    var url = [this.url(), whereClause].join(" ");
    return this.fetch({url: url});
  },

  groupByRegion: function() {
    return _.groupBy(this.toJSON(), 'region_name');
  },

  withRankForIndicator: function(id) {
    var query = SQL({ id: id }),
        url = this._urlForQuery(query);

    return this.fetch({url: url});
  },

  downloadRanksForIndicator: function(id) {
    var query = SQL({ id: id }),
        url = this._urlForQuery(query) + '&format=csv';

    return url;
  }
});

module.exports = Countries;
