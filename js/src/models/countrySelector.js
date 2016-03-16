var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var CountrySelectorModel = Backbone.Model.extend({

  defaults: {
    iso: null,
    order: null,
    year: null
  }
});

module.exports = CountrySelectorModel;
