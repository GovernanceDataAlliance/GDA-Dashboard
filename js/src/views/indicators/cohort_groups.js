var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var CohortCollection = require('../../collections/cohort_groups.js');

var cohortGroupsTemplate = Handlebars.compile(require('../../templates/indicators/cohort_groups_template.hbs'));

var CohortGroupsView = Backbone.View.extend({

  events: {
    'click .group-selector' : 'groupSelected'
  },

  /*
   * This view draws cohort groups and handles when one of them has been clicked.
   */
  initialize: function() {
    this.cohortCollection = new CohortCollection();

    this.cohortCollection.fetch().done(function (data) {
      var groups = this.cohortCollection.getGroups();
      this.render(groups);
    }.bind(this));

  },

  render: function(groups) {
    this.$el.html(cohortGroupsTemplate({ 'cohortGroups': groups }));
    this.cacheVars();
  },

  cacheVars: function() {
    this.groupSelector = $('.js--btn-ranking');
  },

  groupSelected: function(e) {
    var categoryName = $(e.currentTarget).attr('data-rankGroup');
    var categoryGroup = $(e.currentTarget).attr('data-rankCategory');

    Backbone.Events.trigger('rankGroup:chosen', categoryGroup, categoryName);
    this.groupSelector.html(categoryName);

    //Hide panel.
    this.$el.addClass('is-hidden');
  }
});

module.exports = CohortGroupsView;
