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
    //TODO move this to the QUERY.
    var countries = this.direction === 'down' ? this.countries.reverse() : this.countries;
    this.$el.html(template({
      'countries': this._setTier(countries),
      'direction': this.direction
    }));

  }
});

module.exports = IndicatorListView;
