var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  enquire = require('enquire.js');

var TooltipView = require('../common/tooltip_view.js');

var tpl = Handlebars.compile(require('../../templates/common/legend_tpl.hbs')); 

var Legend = Backbone.View.extend({

  events: {
    'click #legendPopup': '_toggleTooltip'
  },

  template: tpl,

  initialize: function() {

    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    this.render();
  },

  render: function() {
    this.$el.append(this.template({ 'mobile': this.mobile }));
  },

  _toggleTooltip: function(e) {
    new TooltipView({ 'el': this.$('.c-tooltip') }).toggleStatus(e);
  },

});

module.exports = Legend;
