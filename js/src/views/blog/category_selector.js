var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  defaults: {
    title: 'Blog posts from'
  },

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function() {
    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    this.title = document.getElementById('categoryTitle');
    this.post = $('.blog-filter');
    this.render();
  },

  render: function() {
    this.hash = window.location.hash;

    if (this.hash) {
      var category = this.hash.substring(1);
      this.setTitle(category);
      this.setActive(category);
      this.$('select').val(category);
    } else {
      this.post.removeClass('-active');
      $('#blog').addClass('-active');
    }

    if (!this.mobile) {
      this.$('select').chosen();
    }
  },

  setTitle: function(title) {
    if (title === 'all') {
      this.title.innerHTML = this.defaults && this.defaults.title ? this.defaults.title + ' ' + title + ' ' + this.title.getAttribute('data-type') : null;
    } else {
      this.title.innerHTML = this.defaults && this.defaults.title ? this.defaults.title + ' ' + title : null;
    }
  },

  setActive: function(id) {
    if (id === 'all' ) {
      this.post.removeClass('-active');
      $('#blog').addClass('-active');
    } else {
      this.post.each(function(index, category) {
        if (category.id === id){
          category.classList.add('-active');
        } else {
          category.classList.remove('-active');
        }
      });
    }

    this.$('select').val(id);
  },

  onChangeSelect: function(e) {
    
    var category = e.currentTarget.value;
    window.location.href = category.length > 0 ?
       'categories#' + category :  'categories';
  }

});

module.exports = CategorySelector;
