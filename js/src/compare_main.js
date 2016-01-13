var $ = require('jquery'),
		Backbone = require('backbone');
    

var Router = require('./routers/compare.js'),
    router = new Router({
      $el: $('.js--compare-container')
    });

Backbone.history.start();
