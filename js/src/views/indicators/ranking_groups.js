var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var RankingCollection = require('../../collections/ranking_groups.js');

var rankingGroupsTemplate = Handlebars.compile(
  require('../../templates/indicators/ranking_groups_template.hbs'));

var RankingGroupsViews = Backbone.View.extend({

  events: {
    'click .group-selector' : 'groupSelected'
  },


  /*
   * This view draws cohort groups and handles when one of them has been clicked.
   */
  initialize: function(options) {
    options = options || {};
    this.rankingCollection = new RankingCollection();

    this.render();
  },

  render: function() {
    this.rankingCollection.fetch().done(function (rawData) {
      this.groups = this.getGroups(rawData);
      this.$el.html(rankingGroupsTemplate({ 'rankingGroups': this.groups }));
      this.cacheVars();
    }.bind(this));
  },

  cacheVars: function() {
    this.groupSelector = $('.js--btn-ranking');
  },

  getGroups: function(rawData) {
    var categories = ["region", "income_group", "lending_category"];

    var data = rawData.rows;
    //Grouped by categories
    this.rankingGroups = {};
    categories.forEach(function(category) {
      var groupByCategory = _.groupBy(_.sortBy(data, category), category);
      this.rankingGroups[category] = groupByCategory;
    }.bind(this));

    return this.rankingGroups;
  },

  groupSelected: function(e) {
    var group;
    var groupName = $(e.currentTarget).attr('data-rankGroup');
    var categoryName = $(e.currentTarget).attr('data-rankCategory');

    if (groupName === "global") {
      group = null;
    } else {
      group = this.rankingGroups[categoryName][groupName];
    }

    Backbone.Events.trigger('rankGroup:chosen', group);
    this.groupSelector.html(groupName);

    //Hide panel.
    this.$el.addClass('is-hidden');
  }
});

module.exports = RankingGroupsViews;
