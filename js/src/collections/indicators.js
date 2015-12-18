var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/indicators.sql.hbs'));

var defaultScores = [
  { 'short_name': 'corruption_perceptions_index', 'score': 'no data' }, 
  { 'short_name': 'doing_business', 'score': 'no data' }, 
  { 'short_name': 'doing_business_DTF', 'score': 'no data' }, 
  { 'short_name': 'environmental_democracy_index', 'score': 'no data' }, 
  { 'short_name': 'freedom_in_the_world', 'score': 'no data' }, 
  { 'short_name': 'freedom_of_the_press', 'score': 'no data' }, 
  { 'short_name': 'freedom_on_the_net', 'score': 'no data' }, 
  { 'short_name': 'global_integrity_report', 'score': 'no data' }, 
  { 'short_name': 'irm_action_plan_count_star', 'score': 'no data' }, 
  { 'short_name': 'irm_action_plan_percent_star', 'score': 'no data' }, 
  { 'short_name': 'nations_in_transit', 'score': 'no data' }, 
  { 'short_name': 'ogp_regular_consult_forum', 'score': 'no data' }, 
  { 'short_name': 'resource_governance_index', 'score': 'no data' }, 
  { 'short_name': 'rti_rating', 'score': 'no data'}
];

var Indicators = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  forCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query);
    
    var data = this.fetch({url: url}).done(function (rawData) {
      this.parseData(rawData)
    }.bind(this));

    return data;
  },

  /*
   * Adding elements when no score for that index.
   */
  parseData: function(rawData) {
    $.each(defaultScores, function(i, d) {
      var current = _.findWhere(rawData.rows, {'short_name': d.short_name});
      if (!current) {
        rawData.rows.push(d);
      }
    });
  },

  downloadForCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query) + '&format=csv';
    return url;
  }
});

module.exports = Indicators;
