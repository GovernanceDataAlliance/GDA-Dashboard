var _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/countries_for_index.sql.hbs'));

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

  //For general list at /countries.
  groupByRegion: function() {
    return _.groupBy(_.sortBy(this.toJSON(), 'region_name'), 'region_name');
  },

  countriesForIndicator: function(id, year, categoryGroup, categoryName) {
    var query = SQL({ 
      'id': id, 
      'year': year ? year : null,
      'categoryGroup': categoryGroup != undefined && categoryGroup != 'global' ? encodeURIComponent(categoryGroup) : null,
      'categoryName': encodeURIComponent(categoryName) || null
      }),
      url = this._urlForQuery(query);
    return this.fetch({url: url});
  },

  checkDirection: function(direction) {
    return direction === 'down' ? this.toJSON().reverse() : this.toJSON();
  },

  downloadCountriesForIndicator: function(id) {
    var query = SQL({ id: id }),
        url = this._urlForQuery(query) + '&format=csv';
    return url;
  }
});

module.exports = Countries;
