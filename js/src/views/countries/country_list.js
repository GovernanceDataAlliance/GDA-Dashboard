var Backbone = require('backbone'),
    _ = require('lodash'),
    enquire = require('enquire.js'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/countries/country_list.hbs'));
var templateMb = Handlebars.compile(
  require('../../templates/countries/country_list_mb.hbs'));

var CountryListView = Backbone.View.extend({

  events: {
    'click .js--list-handler' : '_openList'
  },

  initialize: function(options) {
    options = options || {};
    this.countries = options.countries;
    
    this.listenTo(this.countries, 'sync', this.render);

    if (this.countries.length === 0) {
      this.countries.fetch();
    }

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.tablet = true;
        this.render();
      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.tablet = false;
        this.render();
      },this)
    });
  },

  render: function() {
    if (!this.tablet) {
      this.$el.html(template({
        countriesByRegion: this._getRegions()
      }));
    } else {
      this.$el.html(templateMb({
        countriesByRegion: this._getRegions()
      }));
    }
    return this;
  },

  _getRegions: function() {
    var groupedRegions = this.countries.groupByRegion();
    var sortedRegions = _.mapValues(groupedRegions, function(countries, region) {
      return _.sortBy(countries, 'name');
    });

    return sortedRegions;
  },

  _openList: function(e) {
    $(e.currentTarget).toggleClass('list-open');
  }
});

module.exports = CountryListView;
