var _ = require('lodash'),
  Backbone = require('backbone'),
  d3 = require('d3'),
  Handlebars = require('handlebars');

var countryDrawer = require('../../helpers/country_drawer.js');
var countryQuery = require('../../templates/queries/country_topology.hbs');
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

    this.countryQuery = Handlebars.compile(countryQuery);

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

    this.drawFigures();
  },

  drawFigures: function() {
    var figures = this.$('.figure');

    $.each(figures, function(index, figure){
      var iso = $(figure).data('iso');

      var sql = this.countryQuery({
        iso: iso.toUpperCase()
      });

      sql += '&format=topojson';

      var options = {
        element: figure,
        width: 30,
        height: 30
      }

      d3.json('https://gda.cartodb.com/api/v2/sql?q=' + sql, _.bind(function(error, topology) {
        countryDrawer.draw(topology, 0, options, { alerts: true });
      }, this ));
    }.bind(this));
  },


});

module.exports = IndicatorListView;
