var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var Years = require('../../collections/years.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_toolbar.hbs'));

var RankingGroupsViews = require('./ranking_groups.js'),
    IndicatorYearSelector = require('./indicator_year_selector.js');

var IndicatorsToolbarView = Backbone.View.extend({

  events: {
    'click .js--btn-ranking': 'showRankingGroups'
  },

  initialize: function(options) {
    options = options || {};
    this.indicator = options.indicator.id;
  },

  render: function() {
    this.$el.html(template());

    var rankingGroups = new RankingGroupsViews({ el: this.$('.js--ranking-groups') })

    this.renderSelectors();
    
    return this;
  },

  renderSelectors: function() {
    this.getYears().done(function(years) {
      var yearSelectors = new IndicatorYearSelector({ el: this.$('.js--year-selector'), 'years': years.rows, 'actualYear': this.year });
    }.bind(this));
  },

  getYears: function() {
    var years = new Years();
    return years.totalYearsForThisIndex( this.indicator );
  },

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
