var Backbone = require('backbone');

var Router = Backbone.Router.extend({

  routes: {
    ":iso": "show",
    "*path": "index"
  },

  index: function() {
  },

  show: function(iso) {
  }

});

module.exports = Router;
