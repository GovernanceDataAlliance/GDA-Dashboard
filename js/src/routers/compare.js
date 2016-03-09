var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
  CompareView = require('../views/compare/compare.js'),
  WrapperHeaderView = require('../views/common/wrapper_header_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "*path": "compare"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this.setListeners();

    new WrapperHeaderView();
  },

  setListeners: function() {
    Backbone.Events.on('country:selected', (this.countrySelected).bind(this));
    Backbone.Events.on('year:selected', (this.yearSelected).bind(this));
  },

  compare: function() {

    var params =  URI("?" + window.location.hash.split("#")[1]).query(true);

    this.countries = params && params['countries[]'] ? params['countries[]'] : [];
    this.year = params && params['year[]'] ? params['year[]'] : null;

    //When only one value, string instead of array. We need array.
    if ( _.isString(this.countries)) {
      this.countries = [ this.countries ];
    }

    if (!this.views.hasView('compare')) {
      var view = new CompareView({
        'countries': this.countries,
        'year': this.year
      });
      this.views.addView('compare', view);
    } else {
      this.views.getView('compare').setParams(this.countries, this.year);
    }

    this.views.showView('compare');
  },

  //Update countries params
  countrySelected: function(iso, order) {
    this.countries[order - 1] = iso;
    this.updateUrl();
  },

  //Update year params
  yearSelected: function(year) {
    this.year = year;
    this.updateUrl();
  },

  //Update URL
  updateUrl: function() {
    var hashCountries = '',
      hasYear = 'year[]=';

    $.each(this.countries, function(i, country) {
      hashCountries += 'countries[]=' + country + '&';
    }.bind(this));

    hasYear += this.year;

    this.navigate(hashCountries + hasYear);
  }
});

module.exports = Router;
