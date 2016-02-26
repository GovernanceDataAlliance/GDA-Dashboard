var _ = require('lodash'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/indicators/indicators_selectors_toolbar.hbs'));

var Years = require('../../collections/years.js');

var CohortGroups = require('./cohort_groups.js'),
  YearSelector = require('../common/year_selector.js'),
  LegendView = require('../common/legend.js');

var IndicatorsToolbarView = Backbone.View.extend({

  events: {
    'click .js--btn-ranking': 'showRankingGroups'
  },

  initialize: function(options) {
    options = options || {};

    this.indicator = options.indicator.id;
    this.years = options.years;
    this.actualYear = options.actualYear;
  },

  render: function() {
    this.$el.html(template());

    this.renderCohortGroups();
    this.renderYearSelector();
    this.renderLegend();

    return this;
  },

  renderLegend: function() {
    var legends = this.$('.js--legend');
    _.each(legends, function(legend) {
      new LegendView({ el: legend });
    });
  },

  renderCohortGroups: function() {
    new CohortGroups({ el: this.$('.js--ranking-groups') })
  },

  renderYearSelector: function() {
    this.getYears().done(function(years) {
      var yearSelectors = new YearSelector({
        el: this.$('.js--year-selector-indicators'),
        'years': years.rows,
        'actualYear': this.actualYear
      });
    }.bind(this));
  },

  getYears: function() {
    return new Years().totalYearsForThisIndex(this.indicator);
  },

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
