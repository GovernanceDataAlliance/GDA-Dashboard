var _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var ColorService = require('../lib/services/colors.js');
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

  /*
   * Adding color schema.
   */
  parse: function(rawData) {
    var classColor;

    $.each(rawData.rows, _.bind(function(i, d) {
      var current = d;

      if (current) {
        classColor = this._setColorsByScore(current);
        if (!classColor) {
          return;
        }
        _.extend(current, {'classColor': this._setColorsByScore(current)});
      }

    }, this));

    return rawData.rows;
  },

  _setColorsByScore: function(indicator) {
    if (!indicator.score_range) {
      return;
    }

    return ColorService.getColor(indicator);
  },

  downloadCountriesForIndicator: function(id, year, categoryGroup, categoryName) {

    console.log(id, year, categoryGroup, categoryName);
    var query = SQL({
      id: id,
      year: year,
      categoryGroup: categoryGroup,
      categoryName, categoryName
    }),
     url = this._urlForQuery(query) + '&format=csv';
    return url;
  }
});

module.exports = Countries;
