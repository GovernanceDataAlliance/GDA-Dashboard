var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_toolbar.hbs'));

var RankingGroupsViews = require('./ranking_groups.js');

var IndicatorsToolbarView = Backbone.View.extend({

  events: {
    'click .js--btn-ranking': 'showRankingGroups'
  },

  initialize: function(options) {
    options = options || {};
  },

  render: function() {
    this.$el.html(template());

    var rankingGroups = new RankingGroupsViews({ el: this.$('.js--ranking-groups') })
    
    return this;
  },

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
