var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/indicators/indicator_header.hbs'));

var IndicatorHeaderView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};
    this.indicator = options.indicator;
    this.listenTo(this.indicator, 'sync', this.render);

    // if (!this.hasRequiredAttributes()) {
    //   this.indicator.fetch();
    // }
  },

  render: function() {
    this.$el.html(template({
      'indicator': this.indicator.toJSON()
    }));

    return this;
  },

  hasRequiredAttributes: function() {
    var currentAttributes = _.keys(this.indicator.attributes),
        requiredAttributes = ['short_name'];

    return _.intersection(currentAttributes, requiredAttributes).length > 0;
  }
});

module.exports = IndicatorHeaderView;
