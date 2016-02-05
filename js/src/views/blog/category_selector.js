var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
    Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function(options) {
    options = options || {};
    this.render();
  },

  render: function() {
    this.$('select').chosen();
  },

  onChangeSelect: function(e) {
    console.log('go to category');
  }

});

module.exports = CategorySelector;
