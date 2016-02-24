var Handlebars = require('handlebars');

Handlebars.registerHelper('round', function(options) {

  if (!Number.isNaN(parseFloat(this.score))) {
    if (this.score % 1 != 0) {
      return parseFloat(this.score).toFixed(2);
    } else {
      return this.score;
    }
  } else {
    return this.score;
  }

});

Handlebars.registerHelper('beautifullStrign', function(options) {
  return options.replace('_', ' ');
});
