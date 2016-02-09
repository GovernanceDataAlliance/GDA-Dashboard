var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
    _ = require('lodash'),
    enquire = require('enquire.js'),
    Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  defaults: {
    title: 'Blog posts from '
  },

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function(options) {
    options = options || {};

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
    this.categories = $('.blog-category');
    this.render();
  },

  render: function() {
    this.hash = window.location.hash;

    if (this.hash) {
      this.setTitle(this.hash.substring(1));
      this.setActive(this.hash.substring(1));
      this.$('select').val(this.hash);
    }

    if (!this.mobile) {
      this.$('select').chosen();
    }
  },

  setTitle: function(title) {
    if (title === 'all'){
      this.title.innerHTML = this.defaults.title + title + ' categories';
    } else {
      this.title.innerHTML = this.defaults.title + title;
    }
  },

  setActive: function(id) {
    if (id === 'all' ) {
      this.categories.addClass('-active');
    } else {
      this.categories.each(function(index, category) {
        if (category.id === id){
          category.classList.add('-active');
        } else {
          category.classList.remove('-active');
        }
      });
    }
  },

  onChangeSelect: function(e) {
    window.location = e.currentTarget.value;
  }

});

module.exports = CategorySelector;
