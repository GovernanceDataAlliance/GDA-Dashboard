var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../lib/format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";
var CartoDBModel = require('../lib/cartodb_model.js');

var infoIndicatorSQL = Handlebars.compile(require('../templates/queries/indicator_info.sql.hbs'));

var InfowindowModel = CartoDBModel.extend({

  _url: function(query) {
    return format(BASE_URL, 'gda') + "?q=" + query;
  },

  getIndicator: function(opts) {
    var query = infoIndicatorSQL({
      indicator_id: opts.indicator
    }),
    url = this._url(query);

    return this.fetch({url: url});
  }

});

module.exports = InfowindowModel;
