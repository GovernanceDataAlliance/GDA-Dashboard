var Backbone = require('backbone'),
    _ = require('lodash'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var Countries = require('../../collections/countries.js');
var CountryList = require('./country_list.js');

var SearchView = require('../common/search_view.js');
var SearchMobileView = require('../common/search_mobile_view.js');

var template = Handlebars.compile(
  require('../../templates/countries/countries.hbs'));

var CountriesView = Backbone.View.extend({
  
  initialize: function(options) {
    options = options || {};
    this.countries = new Countries();

    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
  },

  render: function() {
    this.$el.html(template());
    this.renderCountryList();

    this.initViews();

    return this;
  },

  renderCountryList: function() {
    var listView = new CountryList({ countries: this.countries });
    this.$('.js--countries-list').html(listView.render().el);
  },

  initViews: function() {
    if (!this.mobile) {
      var search = new SearchView({ el: $('.js--search') });
    } else {
      var searchMobile = new SearchMobileView({ el: $('.js--search') });
    }
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountriesView;
