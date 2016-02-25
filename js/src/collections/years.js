var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var totalYearsSQL = Handlebars.compile(require('../templates/queries/total_years.sql.hbs')),
  yearsForThisIndexSQL = Handlebars.compile(require('../templates/queries/years_for_this_index.sql.hbs'));


var Years = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.indicator_data_table_name,

  // Get latest year available
  getLastYear:function() {
    return this.at(0).get('year');
  },

  totalYears: function() {
    var query = totalYearsSQL({ 'table': this.table }),
        url = this._urlForQuery(query);

    return this.fetch({url: url});
  },

  totalYearsForThisIndex: function(index) {
    var query = yearsForThisIndexSQL({ 'table': this.table, 'index': index }),
        url = this._urlForQuery(query);

    return this.fetch({url: url});
  }

});

module.exports = Years;
