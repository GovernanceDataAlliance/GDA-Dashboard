var _ = require('lodash'),
    Backbone = require('backbone'),
    d3 = require('d3'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var countryDrawer = require('../../helpers/country_drawer.js');

var template = Handlebars.compile(
  require('../../templates/countries/country_header.hbs'));


var CountryHeaderView = Backbone.View.extend({

  events: {
    'change #notCoveredSwitcher' : 'toogleNotCoveredItems'
  },

  initialize: function(options) {
    options = options || {};
    this.country = options.country;
    this.listenTo(this.country, 'sync', this.render);

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.tablet = true;
      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.tablet = false;
      },this)
    });

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
      'name': this.country.get('name'),
      'siteURL': SITEURL
    }));

    if (!this.tablet) {
      this.drawCountry();
    }

    return this;
  },

  hasRequiredAttributes: function() {
    var currentAttributes = _.keys(this.country.attributes),
        requiredAttributes = ['name'];

    return _.intersection(currentAttributes, requiredAttributes).length > 0;
  },

  toogleNotCoveredItems: function(e) {
    $('.-not-covered').toggleClass('is-hidden', e.currentTarget.checked);

    var label = e.currentTarget.checked ? 'show not covered' : 'hide not covered'
    this.$('.c-switcher--label').html(label);
  }
});

module.exports = CountryHeaderView;
