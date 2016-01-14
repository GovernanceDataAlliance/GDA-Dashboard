var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var CohortCollection = require('../../collections/cohort_groups.js');

var cohortGroupsTemplate = Handlebars.compile(
  require('../../templates/indicators/cohort_groups_template.hbs'));

var CohortGroupsView = Backbone.View.extend({

  events: {
    'click .group-selector' : 'groupSelected'
  },


  /*
   * This view draws cohort groups and handles when one of them has been clicked.
   */
  initialize: function(options) {
    options = options || {};
    this.cohortCollection = new CohortCollection();

    this.render();
  },

  render: function() {
    this.cohortCollection.fetch().done(function (rawData) {
      this.groups = this.getGroups(rawData);
      this.$el.html(cohortGroupsTemplate({ 'cohortGroups': this.groups }));
      this.cacheVars();
    }.bind(this));
  },

  cacheVars: function() {
    this.groupSelector = $('.js--btn-ranking');
  },

  getGroups: function(rawData) {
    return _.groupBy(rawData.rows, 'type');
  },

  groupSelected: function(e) {
    var categoryName = $(e.currentTarget).attr('data-rankGroup');
    var categoryGroup = $(e.currentTarget).attr('data-rankCategory');

    var year = null;

    Backbone.Events.trigger('rankGroup:chosen', year, categoryGroup, categoryName);
    this.groupSelector.html(categoryName);

    //Hide panel.
    this.$el.addClass('is-hidden');
  }
});

module.exports = CohortGroupsView;
