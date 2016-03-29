var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  IndicatorsView = require('../views/indicators/indicators.js'),
  IndicatorView = require('../views/indicators/indicator.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js');

var Router = Backbone.Router.extend({

  routes: {
    ":params": "show",
    "*path": "index"
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });

    this._setListeners();

    new MobileMenuView();
  },

  _setListeners: function() {
    Backbone.Events.on('router:update', (this._updateParams).bind(this));
  },

  index: function() {
    if (!this.views.hasView('index')) {
      this.views.addView('index', new IndicatorsView());
      this.views.showView('index');
    } else {
      this.views.showView('index');
      this.views.getView('index').renderIndicatorsList();
    }
  },

  show: function(params) {
    var configView = {
      id: params.split(":")[0],
      year: params.split(":")[1] || null
    };

    if (!this.views.hasView('show')) {
      this.views.addView('show', new IndicatorView(configView));
    } else {
      this.views.getView('show').update(configView);
    }

    this.views.showView('show');
  },

  _updateParams: function(params) {
    var id = params.id,
      year = params.year;

    this.navigate(id + ':' + year);
  }

});

module.exports = Router;
