var Backbone = require('backbone'),
    _ = require('lodash'),
    d3 = require('d3'),
    Handlebars = require('handlebars');

var countryDrawer = require('../../helpers/country_drawer.js');


var template = Handlebars.compile(
  require('../../templates/countries/country_header.hbs'));


var CountryHeaderView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};
    this.country = options.country;
    this.listenTo(this.country, 'sync', this.render);

    if (!this.hasRequiredAttributes()) {
      this.country.fetch();
    }
  },

  drawCountry: function() {
    var iso = this.country.get('iso3'),
       sql;

      sql = ["SELECT the_geom FROM world_borders WHERE iso3 = UPPER('" + iso + "')&format=topojson"].join(' ');

      d3.json('https://gda.cartodb.com/api/v2/sql?q=' + sql, _.bind(function(error, topology) {
        countryDrawer.draw(topology, 0, { alerts: true });
      }, this )); 
  },

  render: function() {
    this.$el.html(template({
      name: this.country.get('name')
    }));

    this.drawCountry();

    return this;
  },

  hasRequiredAttributes: function() {
    var currentAttributes = _.keys(this.country.attributes),
        requiredAttributes = ['name'];

    return _.intersection(currentAttributes, requiredAttributes).length > 0;
  }
});

module.exports = CountryHeaderView;
