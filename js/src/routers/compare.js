var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
  CompareView = require('../views/compare/compare.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "*path": "compare"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this.setListeners();

    new MobileMenuView();
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
  _updateUrl: function(p) {
    var isCollection = false,
      url = 'countries=';

    if (typeof p.toJSON === 'function') {
      isCollection = true;
      params= p.toJSON();

      params = _.omit(params, function(p) {
        return !p.iso || p.iso == 'no_data' || !p.year || p.year == 'no-data';
      });

      totalData = _.size(params);

    } else {
      params = [];
      _.each(p, function(slide) {

        if(slide.status.get('iso') && slide.status.get('iso') !== 'no_data'
          && slide.status.get('year') && slide.status.get('year') !== 'no-data') {
          params.push(slide.status);
        }

      });

      totalData = params.length;
    }

    if (isCollection) {

      if(totalData == 0) {
        url = 'default';
      }

      _.each(params, function(country, i) {

        url +=  country.iso + ':' + country.year;

        if(Number(i) + 1 < totalData) {
          url += ',';
        }

      }.bind(this));

    } else {

      if(totalData == 0) {
        url = 'default';
      } else {
        url = 'countries=';
      }

      _.each(params, function(slide, i) {
        url += slide.get('iso') + ':' + slide.get('year');

        if(i + 1 < totalData) {
          url += ',';
        }
      });

    }
    this.navigate(url);
  }

});

module.exports = Router;
