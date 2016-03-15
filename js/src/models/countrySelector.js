var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var order = 1;

var CountrySelectorModel = Backbone.Model.extend({

  defaults: {
    iso: null,
    order: null,
    year: null
  },

  initialize: function() {
    this.set('order', order);
    order += 1;
  }

});

module.exports = CountrySelectorModel;
