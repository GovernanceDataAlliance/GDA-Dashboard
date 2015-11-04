var Backbone = require('backbone');

var Router = Backbone.Router.extend({

  routes: {
    "compare": "compare",
    ":iso": "show",
    "*path": "index"
  },

  index: function() {
  },

  show: function(iso) {
  },

  compare: function() {
  }

});

module.exports = Router;
