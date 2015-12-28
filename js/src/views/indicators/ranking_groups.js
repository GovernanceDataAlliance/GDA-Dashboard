var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var RankingCollection = require('../../collections/ranking_groups.js');

var rankingGroupsTemplate = Handlebars.compile(
  require('../../templates/indicators/ranking_groups_template.hbs'));

var RankingGroupsViews = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};
    this.rankingCollection = new RankingCollection();

    this.render();
  },

  render: function() {
    this.rankingCollection.fetch().done(function (rawData) {

      this.groups = this.getGroups(rawData);
      // console.log(this.groups);
      console.log(this.$el);

      this.$el.html(rankingGroupsTemplate({ 'rankingGroups': this.groups }));
    }.bind(this));
  },

  getGroups: function(rawData) {
    var categories = ["continent", "region_wb", "subregion", "economy"];

    var data = rawData.rows;
    //Grouped by categories
    var rankingGroups = {};
    categories.forEach(function(category) {
      var groupByCategory = _.groupBy(data, category);
      rankingGroups[category] = groupByCategory;
    });

    return rankingGroups;
  },
});

module.exports = RankingGroupsViews;
