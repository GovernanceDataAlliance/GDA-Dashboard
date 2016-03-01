var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var modalWindowtemplate = require('../../templates/common/modal_window_tpl.hbs');

var ModalWindowView = Backbone.View.extend({

  el: 'body',

  events: function() {
    if (window.ontouchstart) {
      return  {
        'touchstart .btn-close-modal': 'close',
        'touchstart .modal-background': 'close'
      };
    }
    return {
      'click .btn-close-modal': 'close',
      'click .modal-background': 'close'
    };
  },

  initialize: function(options, data) {
    this.type = options ? options.type : 'legend-infowindow';

    this.generateTemplate();

    // if (data) {
    //   this.render(data);
    // }

    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  generateTemplate: function() {
    var $tpl = $(modalWindowtemplate);
    var base = $tpl.filter('#infowindow-base').html();
    var current = $tpl.filter( '#'+ this.type ).html();

    var baseTpl = Handlebars.compile(base);
    var currentTpl = Handlebars.compile(current);

    this.template = $(baseTpl).find('#content').append( currentTpl );

    this.render();
  },

  render: function(info) {
    this.fixed = true;
    console.log(this.template);
    this.$el.append( this.template );
    this.toogleState();
  },

  onKeyUp: function(e) {
    // press esc
    if (e.keyCode === 27) {
      this.close(e);
    }
  },

  close: function(e) {
    e && e.stopPropagation();
    this.fixed = false;

    $('.m-modal-window').remove();
    this.toogleState();
  },

  toogleState: function() {
    this.$el.toggleClass('is-inmobile', this.fixed);
    $('html').toggleClass('is-inmobile', this.fixed);
  }

});

module.exports = ModalWindowView;
