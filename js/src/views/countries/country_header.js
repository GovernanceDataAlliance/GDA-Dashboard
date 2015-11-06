var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

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

  render: function() {
    this.$el.html(template({
      name: this.country.get('name')
    }));

    return this;
  },

  hasRequiredAttributes: function() {
    var currentAttributes = _.keys(this.country.attributes),
        requiredAttributes = ['name'];

    return _.intersection(currentAttributes, requiredAttributes).length > 0;
  }
});

module.exports = CountryHeaderView;
