var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var TextShortener = require('../common/text_shortener.js');

var template = Handlebars.compile(require('../../templates/indicators/indicator_header.hbs'));

var IndicatorHeaderView = Backbone.View.extend({

  initialize: function(options) {

    this.indicator = options.indicator;

    this._setListeners();
  },

  _setListeners: function() {
    this.listenTo(this.indicator, 'sync', this.render);
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
