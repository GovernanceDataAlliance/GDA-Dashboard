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
    Backbone.Events.on('router:update', (this._updateUrl).bind(this));
  },

  compare: function() {

    var params =  URI("?" + window.location.hash.split("#")[1]).query(true);
    var data = {};


    if (params.countries) {
      var c = params.countries;
      data = c.split(',');
    }

    if (!this.views.hasView('compare')) {
      this.views.addView('compare', new CompareView(data));
    } else {
      this.views.getView('compare').update(data);
    }

    this.views.showView('compare');
  },

  //Update URL
  _updateUrl: function(countriesCollection) {
    var params = countriesCollection.toJSON(),
      url = 'countries=',
      totalData;

    params = _.omit(params, function(p) {
      return !p.iso || p.iso == 'no_data';
    });

    totalData = _.size(params);

    if(totalData == 0) {
      url = '';
    }

    $.each(params, function(i, country) {

      url +=  country.iso + ':' + country.year;

      if(Number(i) + 1 < totalData) {
        url += ',';
      }

    }.bind(this));

    this.navigate(url);
  }
});

module.exports = Router;
