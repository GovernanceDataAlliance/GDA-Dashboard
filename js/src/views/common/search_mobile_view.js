var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');

var template = Handlebars.compile(require('../../templates/common/search_mobile_tpl.hbs'));

var SearchCollection = require('../../collections/countries.js');

var SearchMobileView = Backbone.View.extend({

  el: "#searchBox",

  initialize: function(settings) {
    this.searchCollection = new SearchCollection();

    this.searchCollection.fetch().done(function(){
      this.render();
    }.bind(this));
  },

  render: function() {
    this.$el.html(template({ 'countries': this.searchCollection.toJSON() }));
  }
});

module.exports = SearchMobileView;
