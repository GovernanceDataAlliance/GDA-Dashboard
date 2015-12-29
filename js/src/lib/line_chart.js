var d3 = require('d3'),
    $ = require('jquery');

var LineChart = function(params) {
  var elem = params.elem;
  var $el = $(elem);
  var contentWidth = 250;
  var contentHeight = 100;
  var data = params.data;
  var dateFormat = params.dateFormat || '%Y';
  var hover = params.hover;
  var interpolate = params.interpolate || 'cardinal';
  var loader = params.loader || null;
  var infoWindow = params.infoWindowText || '';
  var decimals = params.decimals || 0;
  var unit = params.unit || '';
  var margin = params.margin || {
    top: 30,
    right: 0,
    bottom: 40,
    left: 0,
    xaxis: 10,
    tooltip: 1.8
  };

  var width = contentWidth,
      height = contentHeight;

  var parseDate = d3.time.format('%Y').parse;
  var bisectDate = d3.bisector(function(d) { return d.year; }).left;

  var width = width,
      height = height;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(d3.time.format(dateFormat));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(7)
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(4);

  var line = d3.svg.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.score); })
      .interpolate(interpolate);

  var svg = d3.select(elem).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate('+margin.left+',' + margin.top + ')');


  data.forEach(function(d) {
    d.year = parseDate(d.year.toString());
  });

  x.domain(d3.extent(data, function(d) { return d.year; })).nice();
  y.domain(d3.extent(data, function(d) { return d.score ; })).nice();

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height) + ')')
    .call(xAxis);

  svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

  if(loader) {
    $el.removeClass(loader);
  }
};

module.exports = LineChart;
