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

    this.years = options.years;
    this.actualYear = options.actualYear;
  },

  render: function() {
    this.$el.html(template());

    this._renderCohortGroups();
    this._renderLegend();
    this._renderYearSelector();

    return this;
  },

  _renderLegend: function() {
    _.each(this.$('.js--legend'), function(legend) {
      new LegendView({ el: legend });
    });
  },

  _renderCohortGroups: function() {
    new CohortGroups({
      el: this.$('.js--ranking-groups')
    });
  },

  _renderYearSelector: function() {
    // take a look..
    setTimeout(function() {
      new YearSelector({
        el: this.$el.find('.js--year-selector-indicators'),
        years: this.years,
        actualYear: this.actualYear
      }).render();

    }.bind(this), 0);
  },

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
