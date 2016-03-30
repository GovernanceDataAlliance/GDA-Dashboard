var $ = require('jquery'), _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var ColorService = require('../lib/services/colors.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/countries_for_index.sql.hbs')),
    countriesListSQL = Handlebars.compile(require('../templates/queries/countries_list.sql.hbs'));

var Countries = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.country_table_name,

  url: function() {
    var query = countriesListSQL({ table: this.table });
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

      if (current['score_text']) {
        current['score'] = current['score_text'];
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
    var query = SQL({
      'id': id,
      'year': year,
      'categoryGroup': categoryGroup ? encodeURIComponent(categoryGroup) : null,
      'categoryName': encodeURIComponent(categoryName)
    }),

    url = this._urlForQuery(query) + '&format=csv&filename=countries_for_' + id;

    return url;
  }
});

module.exports = Countries;
