var _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var IndicatorConfigs = require('../../collections/indicator_configs.js');
var IndicatorList = require('./indicator_list.js');

var template = Handlebars.compile(
  require('../../templates/indicators/indicators.hbs'));

var RetractableMenuView = require('../common/retractable_menu_view.js');

var IndicatorsView = Backbone.View.extend({

  initialize: function() {
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

    this.indicatorsData = null;

    // collections
    this.indicators = new IndicatorConfigs();

    this._getIndicators();
  },

  initViews: function() {
    if (this.mobile) {
      new RetractableMenuView();
    }
  },

  _getIndicators: function() {
    this.indicators.indicatorsForList().done(function(data) {
      this.indicatorsData = data.rows;
      this.renderIndicatorsList();
    }.bind(this))
  },

  renderIndicatorsList: function() {
    var listView = new IndicatorList({
      indicators: this.indicatorsData
    });

    this.$('.js--indicators').html(listView.render().el);
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = IndicatorsView;
