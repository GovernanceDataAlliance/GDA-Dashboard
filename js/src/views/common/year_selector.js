var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/common/year_selector.hbs'));

var CompareYearSelectors = Backbone.View.extend({

  events: {
    'change select': 'getYear'
  },

  initialize: function(options) {
    options = options || {};
    this.years = options.years;
    this.actualYear = options.actualYear;
    this.render();
  },

  render: function() {
    this.$el.html(template({ 'years': this.years }));
    this.setCurrentYear();
    Backbone.Events.trigger('year:selected', this.actualYear);

    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.tablet = true;
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.tablet = false;
      },this)
    });

    if (!this.tablet) {
      this.$('select').chosen();
    }

  },

  setCurrentYear: function() {
    this.actualYear ? $('#year-'+ this.actualYear ).attr('selected', true) : $(this.$('option')[0]).attr('selected', true);
  },

  getYear: function(e) {
    var year = $(e.currentTarget).val();
    Backbone.Events.trigger('year:selected', year);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareYearSelectors;
