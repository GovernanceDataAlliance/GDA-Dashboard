var Backbone = require('backbone');

var CompareView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.countryIds = options.countries;
    this.initializeData();
  },

  initializeData: function() {
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CompareView;
