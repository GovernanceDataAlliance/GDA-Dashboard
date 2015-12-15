var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    _ = require('lodash');
    $ = require('jquery');

var template = Handlebars.compile(require('../../templates/common/modal_window_tpl.hbs'));

var ModalWindowView = Backbone.View.extend({

  el: 'body',

  template: handlebars.compile(tpl),

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

  initialize: function(data) {
    if (data) {
      this.render(data);
    }

    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  render: function(data) {
    this.$el.append(this.template(data));
    this.toogleState();
  },

  onKeyUp: function(e) {
    e.stopPropagation();
    // press esc
    if (e.keyCode === 27) {
      this.close();
    }
  },

  close: function() {
    console.log('hola');
    $('.m-modal-window').remove();
    this.toogleState();
  },

  toogleState: function() {
    this.$el.toggleClass('has-no-scroll');
    $('html').toggleClass('has-no-scroll');
  }

});

module.exports = ModalWindowView;