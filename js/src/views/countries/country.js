var Backbone = require('backbone');

var CountryView = Backbone.View.extend({
  render: function() {
    this.$el.html('OHAI');
  },

  show: function() {
    this.render();
  }
});

module.exports = CountryView;
