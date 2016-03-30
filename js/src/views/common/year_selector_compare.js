var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var ParentView = require('./year_selector.js');

var template = require('../../templates/common/year_selector.hbs');

var CompareYearSelectors = ParentView.extend({

  template: Handlebars.compile(template),

  enableSelector: function() {
    var $select = this.$el.find('select');
    $select
      .removeAttr('disabled')
      .trigger('liszt:updated');
  },

  disableSelector: function() {
    var $select = this.$el.find('select');

    $select
      .val('no-data')
      .attr('disabled', 'disabled')
      .trigger('liszt:updated');

  },

  resetYears: function() {
    var $options = this.$('select').find('option');

    _.each($options, function(option) {
      $(option).removeAttr('disabled');
    });

    this.$('select').trigger('liszt:updated');
  },

  filter: function(filteredYears) {
    var $select = this.$el.find('select'),
      currentYear = $select.val();

    this.resetYears();

    _.each(filteredYears, function(year) {

      if (currentYear !== year) {
        $select.find('option[value="' + year + '"]').attr('disabled', 'disabled');
      }

    });

    $select.trigger('liszt:updated');
  },

  checkSelection: function() {
    var $currentOption = this.$('select').find('option[value="' + this.actualYear + '"]');

    if ($currentOption.attr('disabled')) {

      this.actualYear = 'no-data';

      this.$('select')
        .val('no-data')
        .trigger('liszt:updated')
        .trigger('change');
    }
  },

  render: function() {
    this.$el.html(this.template({
      index: this.index,
      years: this.years
    }));

    this.$el.find('select').prepend('<option value="no-data" selected>select a year</option>');

    if (this.actualYear) {
      this._setCurrentYear();
    } else {
      this.$el.find('select').attr('disabled', 'disabled');
    }

    if (!this.mobile && !this.tablet) {
      this.$el.find('select').chosen();
    }

    return this;
  }

});

module.exports = CompareYearSelectors;
