var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators_toolbar.hbs'));

var IndicatorsToolbarView = Backbone.View.extend({

  events: {
  },

  initialize: function(options) {
    options = options || {};
  },

  render: function() {
    this.$el.html(template({}));
    return this;
  }
});

module.exports = IndicatorsToolbarView;
