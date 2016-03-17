var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/indicators/country_list.hbs'));

var IndicatorListView = Backbone.View.extend({

  events: {
    'click .-load-more' : '_loadMore'
  },

  initialize: function(options) {
    options = options || {};

    this.direction = options.direction;
    this.max_score = options.max_score;
    this.countries = options.countries;

    this.render();
  },

  _loadMore: function(e) {
    $(e.currentTarget).addClass('is-hidden');
    $('.rest-tier').removeClass('is-hidden');
  },

  _setTier: function(countries) {
    var limitTop = 10;
    if (!countries.length > limitTop) {
      return countries;
    }

    return {
      top: countries.slice(0, limitTop),
      rest: countries.slice(limitTop, countries.length),
    };
  },

  render: function() {
    this.$el.html(template({
      countries: this._setTier(this.countries),
      max_score: function() {
        if(!isNaN(parseFloat(this.max_score)) && parseInt(this.max_score).toString().length > 3) {
          return parseFloat(this.max_score).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        return this.max_score;
      }.bind(this)()
    }));
  }
});

module.exports = IndicatorListView;
