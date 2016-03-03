var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var ColorService = require('../lib/services/colors.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/indicators.sql.hbs')),
    SQLwithYears = Handlebars.compile(require('../templates/queries/indicators_with_years.sql.hbs')),
    SQLHistoricalData = Handlebars.compile(require('../templates/queries/indicators_historical_data.sql.hbs'));

var Indicators = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  forCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query);

    return this.fetch({url: url})
  },

  forCountryAndYear: function(iso, year) {
    var query = SQLwithYears({ 'table': this.table, 'iso': iso, 'year': year }),
        url = this._urlForQuery(query);

    return this.fetch({url: url})
  },

  historicalData: function(iso, short_name) {
    var query = SQLHistoricalData({ 'table': this.table, 'iso': iso, 'index': short_name }),
        url = this._urlForQuery(query);

    return this.fetch({url: url})
  },

  parse: function(rawData) {

    $.each(rawData.rows, _.bind(function(i, d) {

      if (!this._setColorsByScore(d)) {
        return;
      }
      _.extend(d, {'classColor': this._setColorsByScore(d)});

      if (d['score_text']) {
        d['score'] = d['score_text'];
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

  downloadForCountry: function(opts) {
    var query = SQLwithYears({
      table: this.table,
      iso: opts.iso,
      year: opts.year
    });

    return this._urlForQuery(query) + '&format=csv';
  }
});

module.exports = Indicators;
