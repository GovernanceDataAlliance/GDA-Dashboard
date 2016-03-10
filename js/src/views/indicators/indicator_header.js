var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var TextShortener = require('../common/text_shortener.js'),
  ShareWindowView = require('../common/share_window_view.js');

var template = Handlebars.compile(require('../../templates/indicators/indicator_header.hbs'));

var IndicatorHeaderView = Backbone.View.extend({

  events: {
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function(options) {

    this.indicator = options.indicator;

    window.indicatorId = this.indicator.get('id');

    this._setListeners();

    this.shareWindowView = new ShareWindowView();
  },

  _setListeners: function() {
    this.listenTo(this.indicator, 'sync', this.render);
  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  render: function() {
    this.$el.html(template({
      'indicator': this.indicator.toJSON(),
      'siteURL': SITEURL
    }));

    return this;
  }

});

module.exports = IndicatorHeaderView;
