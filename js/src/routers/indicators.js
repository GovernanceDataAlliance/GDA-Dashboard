var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  IndicatorsView = require('../views/indicators/indicators.js'),
  IndicatorView = require('../views/indicators/indicator.js'),
  WrapperHeaderView = require('../views/common/wrapper_header_view.js');

var Router = Backbone.Router.extend({

  routes: {
    ":params": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
    this.setListeners();

    new WrapperHeaderView();
  },

  setListeners: function() {
    Backbone.Events.on('year:selected', (this.yearSelected).bind(this));
  },

  index: function() {
    if (!this.views.hasView('index')) {
      var view = new IndicatorsView();
      this.views.addView('index', view);
    }

    this.views.showView('index');
  },

  show: function(params) {
    this.id =  params.split("&")[0];
    this.year =  params.split("&")[1] || null;

    if (!this.views.hasView('show')) {
      var view = new IndicatorView({id: this.id, 'year':this.year });
      this.views.addView('show', view);
    } else {
      this.views.getView('show').setIndicator(this.id, this.year);
    }

    this.views.showView('show');
  },

  //Update year params
  yearSelected: function(year) {
    this.year = year;
    this.navigate(this.id +'&'+ year);
  }

});

module.exports = Router;
