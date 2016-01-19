var Backbone = require('backbone'),
    _ = require('lodash'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/countries/country_list.hbs'));
var templateMb = Handlebars.compile(
  require('../../templates/countries/country_list_mb.hbs'));

var CountryListView = Backbone.View.extend({

  initialize: function(options) {

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
        console.log('is tablet')
      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.mobile = false;
        console.log('aint tablet')
      },this)
    });

    options = options || {};
    this.countries = options.countries;
    
    this.listenTo(this.countries, 'sync', this.render);

    if (this.countries.length === 0) {
      this.countries.fetch();
    }
  },

  render: function() {
    this.$el.html(template({
      countriesByRegion: this._getRegions()
    }));

    return this;
  },

  _getRegions: function() {
    var groupedRegions = this.countries.groupByRegion();
    var sortedRegions = _.mapValues(groupedRegions, function(countries, region) {
      return _.sortBy(countries, 'name');
    });

    return sortedRegions;
  }
});

module.exports = CountryListView;
