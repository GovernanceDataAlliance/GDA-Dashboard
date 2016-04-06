var _ = require('lodash'),
    Backbone = require('backbone'),
    d3 = require('d3'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var countryDrawer = require('../../helpers/country_drawer.js');

var countryQuery = require('../../templates/queries/country_topology.hbs');

var template = Handlebars.compile(
  require('../../templates/countries/country_header.hbs'));


var CountryHeaderView = Backbone.View.extend({

  events: {
    'change #notCoveredSwitcher' : 'setNotcoveredStatus'
  },

  initialize: function(options) {
    options = options || {};
    this.country = options.country;
    this.listenTo(this.country, 'sync', this.render);

    this.countryQuery = Handlebars.compile(countryQuery);

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

    this.checked = false;
  },

  drawCountry: function() {
    var iso = this.country.get('iso3'),
      sql;

      sql = this.countryQuery({
        iso: iso.toUpperCase()
      });

      sql += '&format=topojson';

      var options = {
        element: '.js--country-silhouette',
        width: 300,
        height: 175
      };

      d3.json('https://gda.cartodb.com/api/v2/sql?q=' + sql, _.bind(function(error, topology) {
        countryDrawer.draw(topology, 0, options, { alerts: true });
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

    Backbone.Events.on('countriesList:render', _.bind( this.toogleNotCoveredItems, this ));

    return this;
  },

  hasRequiredAttributes: function() {
    var currentAttributes = _.keys(this.country.attributes),
        requiredAttributes = ['name'];

    return _.intersection(currentAttributes, requiredAttributes).length > 0;
  },

  toogleNotCoveredItems: function() {
    $('.-not-covered').toggleClass('is-hidden', this.checked);

    var label = this.checked ? 'show not covered' : 'hide not covered'
    this.$('.c-switcher--label').html(label);
  },

  setNotcoveredStatus: function(e) {
    this.checked = e.currentTarget.checked;
    this.toogleNotCoveredItems();

  }
});

module.exports = CountryHeaderView;
