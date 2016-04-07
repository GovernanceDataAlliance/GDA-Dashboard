var d3 = require('d3'),
  topojson = require('topojson');

var countryHelper = {

  draw: function(topology, c, options) {

    if (!topology) {
      return;
    }

    var country = topojson.feature(topology, topology.objects[c]);
    var width = options.width,
        height = options.height,
        el = options.element;

    var svg = d3.select(el).append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", 'svg-country-silhouette');

    var projection = d3.geo.mercator().scale(1).translate([0, 0]),
      path = d3.geo.path().projection(projection),
      bounds = JSON.parse(country.properties.bbox);

    var b = path.bounds(bounds),
      s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.append("svg:path")
      .data([country])
      .attr("d", path);

    return country;
  }
};

module.exports = countryHelper;
