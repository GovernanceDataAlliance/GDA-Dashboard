var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/countries/partial_ranks.hbs'));

var PartialRanksView = Backbone.View.extend({

  initialize: function(options) {
    options = options || {};

    this.iso = options.iso;
    this.index = options.index;

    console.log(this.iso);
    console.log(this.index);

    this.render();
  },

  render: function() {
    this.$el.html(template());

  }
});

module.exports = PartialRanksView;
