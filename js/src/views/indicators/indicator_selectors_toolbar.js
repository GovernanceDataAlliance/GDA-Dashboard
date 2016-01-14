var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_selectors_toolbar.hbs'));

var CohortGroups = require('./cohort_groups.js'),
    YearSelector = require('../common/year_selector.js');

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
    
    return this;
  },

  renderCohortGroups: function() {
    new CohortGroups({ el: this.$('.js--ranking-groups') })
  },

  renderYearSelector: function() {
    new YearSelector({ 
      el: this.$('.js--indicators-year-selector'), 
      'years': this.years,
      'actualYear': this.actualYear 
    });
  },

  showRankingGroups: function() {
    this.$('.js--ranking-groups').toggleClass('is-hidden');
  }
});

module.exports = IndicatorsToolbarView;
