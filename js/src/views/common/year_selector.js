var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/common/year_selector.hbs'));

var YearSelectors = Backbone.View.extend({

  events: {
    'change select': '_getYear'
  },

  initialize: function(options) {
    options = options || {};

    this.years = options.years;
    this.actualYear = options.actualYear;
    this.index = options.index || null;

    this._setView();
  },

  _setView: function() {
    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function() {
        this.mobile = true;
        this.tablet = false;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function() {
        this.mobile = false;
        this.tablet = true;
      },this)
    });

    enquire.register("screen and (min-width:1025px)", {
      match: _.bind(function() {
        this.tablet = false;
      },this)
    });
  },

  render: function() {
    this.$el.html(template({
      index: this.index,
      years: this.years
    }));

    this._setCurrentYear();

    if (!this.mobile && !this.tablet) {
      this.$el.find('select').chosen();
    }

    return this;
  },

  _setCurrentYear: function() {
    this.$el.find('select').val(this.actualYear);

    Backbone.Events.trigger('year:selected', this.actualYear);
  },

  _getYear: function(e) {
    var year = $(e.currentTarget).val(),
      index = $(e.currentTarget).attr('id').split('-')[1];

    this.actualYear = year;

    Backbone.Events.trigger('year:selected', year);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = YearSelectors;
