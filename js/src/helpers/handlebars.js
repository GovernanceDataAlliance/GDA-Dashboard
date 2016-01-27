var Handlebars = require('handlebars');

Handlebars.registerHelper('round', function(options) {
  if (this.score % 1 != 0) {
    return parseFloat(this.score).toFixed(2);
  } else {
    return this.score;
  }
});

Handlebars.registerHelper('beautifullStrign', function(options) {
  return options.replace('_', ' ');
});


Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
