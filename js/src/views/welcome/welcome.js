var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/welcome/welcome_tpl.hbs'));

var SearchView = require('../common/search_view.js');

var WelcomeView = Backbone.View.extend({

  el: '.js-welcome',

  initialize: function(options) {
    options = options || {};
  },

  show: function() {
    this.render();
  },

  render: function() {
    this.$el.html(template());

    this.initViews();
  },

  initViews: function() {
    var search = new SearchView();
  }

});

module.exports = WelcomeView;
