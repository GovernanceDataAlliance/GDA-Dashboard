var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/indicators.sql.hbs')),
    SQLwithYears = Handlebars.compile(require('../templates/queries/indicators_with_years.sql.hbs'));

var defaultScores = [
  { 'short_name': 'corruption_perceptions_index', 'score': null, 'product_name': 'Corruption Perceptions Index 2014'}, 
  { 'short_name': 'doing_business', 'score': null, 'product_name': 'Doing Business Report' }, 
  { 'short_name': 'doing_business_DTF', 'score': null, 'product_name': 'Doing Business Report' }, 
  { 'short_name': 'environmental_democracy_index', 'score': null, 'product_name': 'Environmental Democracy Index' }, 
  { 'short_name': 'freedom_in_the_world', 'score': null, 'product_name': 'Freedom in the World' }, 
  { 'short_name': 'freedom_of_the_press', 'score': null, 'product_name': 'Freedom of the Press' }, 
  { 'short_name': 'freedom_on_the_net', 'score': null, 'product_name': 'Freedom of the Net' }, 
  { 'short_name': 'global_integrity_report', 'score': null, 'product_name': 'Global Integrity Report' }, 
  { 'short_name': 'irm_action_plan_count_star', 'score': null, 'product_name': 'OGP IRM Number Starred Commitments' }, 
  { 'short_name': 'irm_action_plan_percent_star', 'score': null, 'product_name': 'OGP IRM Percentage of Starred Commitments' }, 
  { 'short_name': 'nations_in_transit', 'score': null, 'product_name': 'Nations in Transit' }, 
  { 'short_name': 'ogp_regular_consult_forum', 'score': null, 'product_name': 'Regular Forum for OGP Stakeholder Consultation' }, 
  { 'short_name': 'resource_governance_index', 'score': null, 'product_name': 'Resource Governance Index'  }, 
  { 'short_name': 'rti_rating', 'score': null, 'product_name': 'RTI Rating' }
];

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

  /*
   * Adding elements when no score for that index.
   */
  parse: function(rawData) {
    $.each(defaultScores, function(i, d) {
      var current = _.findWhere(rawData.rows, {'short_name': d.short_name});
      if (!current) {
        rawData.rows.push(d);
      }
    });

    return rawData.rows;
  },

  downloadForCountry: function(iso) {
    var query = SQL({ table: this.table, iso: iso}),
        url = this._urlForQuery(query) + '&format=csv';

    return this.fetch({url: url});
  }
});

module.exports = Indicators;
