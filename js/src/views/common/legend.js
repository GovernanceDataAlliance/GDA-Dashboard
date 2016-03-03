var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var tpl = Handlebars.compile(require('../../templates/common/legend_tpl.hbs')); 

var Legend = Backbone.View.extend({

  template: tpl,

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.append(this.template({}));
  }

});

module.exports = Legend;
