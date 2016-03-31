var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var Indicators = require('../../collections/indicators.js'),
  IndicatorService = require('../../lib/services/indicator.js');

var IndicatorView = require('./indicator.js');

var TextShortener = require('../common/text_shortener.js');

var template = Handlebars.compile(require('../../templates/countries/indicators-list.hbs'));

var IndicatorListView = Backbone.View.extend({

  el: '.js--indicators',

  initialize: function(options) {
    options = options || {};
    this.indicators = IndicatorService.groupScoresById(options.indicators);
    // this.indicators = options.indicators;
    this.currentYear = options.currentYear;
  },

  render: function() {
    this.$el.html(template);
    this.renderIndicators();
    new TextShortener({ el: this.el });
    return this;
  },

  _scoreToString: function(indicator) {
    if (indicator.get('score') != undefined) {
      indicator.set('score', indicator.get('score').toString());
    }
  },

  renderIndicators: function() {
    this.indicators.each(function(indicator) {
      this._scoreToString(indicator);
      var indicatorView = new IndicatorView({
        'indicator': indicator,
        currentYear: this.currentYear
      });

      this.$('.js--indicators-list').append(indicatorView.render().el);
    }.bind(this));
    
    Backbone.Events.trigger('countriesList:render');
  }

});

module.exports = IndicatorListView;
