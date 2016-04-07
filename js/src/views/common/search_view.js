var $ = require('jquery'),
  _ = require('lodash');
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  enquire = require('enquire.js');

var SearchCollection = require('../../collections/countries.js');

var FunctionHelper = require('../../helpers/functions.js');

var template = Handlebars.compile(require('../../templates/common/search_tpl.hbs')),
    templateSuggestions = Handlebars.compile(require('../../templates/common/search_suggestions_tpl.hbs'));


var SearchView = Backbone.View.extend({

  defaults: {
    elContent: '#searchContent',
    elInput: '#searchMap',
    elSearchParent: '#searchBox',
    elSuggestions: '.search-suggestions',
    closeOnClick: true
  },

  events: {
    'keyup #searchMap' : '_onSearch',
    'focus #searchMap' : 'highlight',
    'keydown #searchMap': 'highlightResultsBox',
    'click .search-area' : '_clearSearch'
  },

  initialize: function(settings) {
    var options = settings && settings.options ? settings.options : settings;
    this.options = _.extend(this.defaults, options);

    // this.count = 0;
    this.selectedIndex = -1;
    this.limit = -1;

    // collections
    this.searchCollection = new SearchCollection();

    // search elements
    this.elContent = this.options.elContent;
    this.elInput = this.options.elInput;
    this.elSearchParent = this.options.elSearchParent;
    this.elSuggestions = this.options.elSuggestions;

    // search options
    this.closeOnClick = this.options.closeOnClick;
    this.listHeight = 300;

    this.debounceHightlight = FunctionHelper.debounce(this._highlightResult, 85, true);

    this._setListeners();

    this._getData();
  },

  _setListeners: function() {
    if(this.closeOnClick) {
      $('body').on('click', this._unHighlight.bind(this));
    }
  },

  render: function() {
    this.$(this.elSearchParent).html(template);
  },

  _getData: function() {
    this.searchCollection.fetch().done(function() {
      this.render();
    }.bind(this));
  },

  _onSearch: function(ev) {
    var target = ev ? ev.currentTarget : this.$input;
      value = $(target).val(),
      key = ev && ev.keyCode ? ev.keyCode : 0;

    if (value && value.length > 0) {

      // up/down keys
      if (key == 40 || key == 38) {

        this._navResults(key);

      // enter
      } else if(key == 13) {

        this._triggerResult();

      // any key
      } else {

        this.$(this.elContent).addClass('searching');
        this.showSuggestions(value);
      }

    } else {

      this.$(this.elContent).removeClass('searching');
      this._clearSuggestions();
    }

    this.positionSearchBox();
  },

  _triggerResult: function() {
    var results = this.$(this.elSuggestions).find('ul').children();

    if (!results[this.selectedIndex]) {
      return;
    }

    results[this.selectedIndex].querySelector('a').click();
  },

  _navResults: function(key) {
    var results = this.$(this.elSuggestions).find('ul').children(),
      totalResults = results.length,
      selectedResult;

    if (!results) {
      return;
    }

    if (key == 38) {

      if (this.selectedIndex - 1 < 0) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex--;
      }

    } else {

      if (!(this.selectedIndex + 1 > totalResults - 1)) {
        this.selectedIndex++;
      } else {
        return;
      }
    }

    selectedResult = results[this.selectedIndex];

    this._scrollResult(selectedResult, key)
    this.debounceHightlight(null, selectedResult);
  },

  _highlightResult: function(e, selectedResult) {
    if (e) {
      var selectedResult = e.target;
      this.selectedIndex = Number($(selectedResult).data('index'));
    }

    var results = this.$(this.elSuggestions).find('ul').children();

    $(results).removeClass('highlight');
    $(selectedResult).addClass('highlight');
  },


  _scrollResult: function(result, key) {

    var itemHeight = result.scrollHeight;

    if (this.selectedIndex > 3) {

      var marginHeight = this.$('.search-box').height() / 2;

      if (key == 38) {

        this.limit -= itemHeight;

        var movement = this.selectedIndex * itemHeight - marginHeight;

        $('.search-box').animate({
          scrollTop: movement + 'px'
        }, 300);

      } else {

        this.limit = itemHeight * this.selectedIndex - marginHeight;

        $('.search-box').animate({
          scrollTop: this.limit + 'px'
        }, 300);
      }

    } else {
      $('.search-box').animate({
        scrollTop: 0
      }, 300);

      this.limit = 0;
    }
  },

  positionSearchBox: function(e) {
    e && e.preventDefault() && e.stopPropagation();

    this.$(this.elInput).addClass('focus');

    var marginFromBottom = 30;

    var heightToScroll = this.$el.offset().top + this.$el.outerHeight() + this.listHeight + marginFromBottom - document.documentElement.clientHeight;

    if (heightToScroll > 100) {
      $('body').animate({scrollTop: heightToScroll + 'px'}, 300);
    }
  },

  _unHighlight: function(ev) {
    var $target = ev ? $(ev.target) : null;
    var id = null

    if($target) {
      id = $target.closest(this.elSearchParent).attr('id');
    }

    if(!id) {
      this._unFocus();
    }
  },

  _unFocus: function() {
    var $input = this.$(this.elInput);

    $input.removeClass('focus');
    $input.blur();
    this._clearSearch();
  },

  showSuggestions: function(text) {
    text = text.toLowerCase();
    var results,
      indexResult= -1;

    results = _.filter(this.searchCollection.toJSON(), function(item, i) {
      var name = item['name'].toLowerCase().replace(/-/gi, ' ');
      var index = name.indexOf(text);
      if(index >= 0) {

        indexResult++;

        var start = item.name.substring(0, index),
          substr = item.name.substring(index, index + text.length),
          end = item.name.substring(index+text.length);

        item.title = item.name;
        item.iso = item.iso;
        item.index = indexResult;
        item.name = start + '<span>' + substr + '</span>' + end;
        item.selected = item.selected || false;

        return item;
      }
    }.bind(this));

    this.$(this.elSuggestions).html(templateSuggestions({
      data: results
    }));

    this.$(this.elContent).addClass('visible');

    this.$(this.elSuggestions).css({ 'max-height': this.listHeight + 'px'});

    this._addEventsResults();
  },

  _addEventsResults: function() {
    var $results = $('.search-area');

    _.each($results, function(result) {
      result.addEventListener('mouseenter', _.bind(this.debounceHightlight, this), false);
    }.bind(this));
  },

  _clearSuggestions: function() {
    this.$el.find('.search-suggestions').html('');
    this.$el.find('#searchContent').removeClass('visible');
    this.selectedIndex = -1;
  },

  _clearSearch: function() {
    var $input = this.$(this.elInput);

    $input.val('');
    this._clearSuggestions();
  }

});

module.exports = SearchView;
