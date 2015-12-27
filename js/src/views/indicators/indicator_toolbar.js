var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var RankingCollection = require('../../collections/ranking_groups.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_toolbar.hbs')),
    rankingGroupsTemplate = Handlebars.compile(
  require('../../templates/indicators/ranking_groups_template.hbs'));

var IndicatorsToolbarView = Backbone.View.extend({

  events: {
    'click .js--btn-ranking': 'showRankingGroups'
  },

  initialize: function(options) {
    options = options || {};
    
    this.rankingCollection = new RankingCollection();
  },

  render: function() {
    this.$el.html(template());

    //Put this into a new view.
    this.renderRankingGroups();
    
    return this;
  },

  renderRankingGroups: function() {
    this.rankingCollection.fetch().done(function (rawData) {

      this.groups = this.getGroups(rawData);
      // console.log(this.groups);

      this.$('.js--ranking-groups').html(rankingGroupsTemplate({ 'rankingGroups': this.groups }));
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

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
