var _ = require('lodash'),
    enquire = require('enquire.js'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js');
var CountryList = require('./country_list.js');

var SearchView = require('../common/search_view.js'),
  SearchMobileView = require('../common/search_mobile_view.js');

var template = Handlebars.compile(
  require('../../templates/countries/countries.hbs'));

var CountriesView = Backbone.View.extend({

  initialize: function() {
    this.countries = new Countries();

    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
         this.initViews();
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
         this.initViews();
      },this)
    });
  },

  render: function() {
    this.$el.html(template());
    this.renderCountryList();

    return this;
  },

  renderCountryList: function() {
    if ($('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').removeClass('is-hidden')
    }
    var listView = new CountryList({ countries: this.countries });
    this.$('.js--countries-list').html(listView.render().el);
  },

  initViews: function() {
    if (!this.mobile) {
      new SearchView({ el: $('.js--search') });
    } else {
      new SearchMobileView({ el: $('.js--search') });
    }
  },

  show: function() {
    this.render();
  },

  // hide: function() {}

});

module.exports = CountriesView;
