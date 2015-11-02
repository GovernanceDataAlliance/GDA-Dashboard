var Backbone = require('backbone'),
    format = require('./format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";

var CartoDBCollection = Backbone.Collection.extend({
  url: function() {
    return format(BASE_URL, this.user_name) + "?q=" + this._getQuery();
  },

  _getQuery: function() {
    var columns = "*";

    if (this.columns !== undefined && this.columns.length > 0) {
      columns = this.columns.join(", ");
    }

    return format("SELECT {0} FROM {1}", columns, this.table);
  },

  parse: function(data) {
    return data.rows;
  }
});

module.exports = CartoDBCollection;
