var $ = require('jquery'),
    _ = require('lodash');

var CartoDBCollection = require('../lib/cartodb_collection.js');
var CONFIG = require('../../config.json');

var Handlebars = require('handlebars');

var SQL = Handlebars.compile(require('../templates/queries/ranking_groups.sql.hbs'));

var RankingGroups = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.ranking_groups_table_name,

  categories: ["continent", "economy", "region_wb", "subregion"],

  rankingGroups: function() {
    var query = SQL({ table: this.table }),
        url = this._urlForQuery(query);

    var data = this.fetch({url: url}).done(function (rawData) {
      var groupsNames = _.keys(rawData.rows[0]);
      var data = rawData.rows;
      console.log(groupsNames);
      console.log(data);

      

    }.bind(this));

  },

});

module.exports = RankingGroups;
