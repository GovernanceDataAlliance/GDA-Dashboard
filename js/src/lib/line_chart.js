var d3 = require('d3'),
    $ = require('jquery');

var LineChart = function(params) {
  var elem = params.elem;
  var $el = $(elem);
  var contentWidth = $el.width();
  var contentHeight = $el.height();
  var data = params.data;
  var dateFormat = params.dateFormat || '%Y';
  var hover = params.hover;
  var interpolate = 'monotone'; //'linear', 'monotone',
  var loader = params.loader || null;
  var infoWindow = params.infoWindowText || '';
  var decimals = params.decimals || 0;
  var unit = params.unit || '';
  var margin = params.margin || {
    top: 10,
    right: 10,
    bottom: 10,
    left: 1,
    xaxis: 10,
    tooltip: 1.8
  };


  var width = contentWidth - margin.right - margin.left,
      height = contentHeight - margin.top - margin.bottom;

  var parseDate = d3.time.format('%Y').parse;
  var parseYear = d3.time.format('%Y');
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
      .tickFormat(d3.time.format(dateFormat));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

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


var xValue = function(d) { return d.year;};
var xMap = function(d) { return x(xValue(d));};
    

var yValue = function(d) { return d.score;};
var yMap = function(d) { return y(yValue(d));};
   

// svg.append('g')
//   .attr('class', 'y axis')
//   .call(yAxis);

// svg.append('g')
//   .attr('class', 'x axis')
//   .attr('transform', 'translate(0,' + (height) + ')')
//   .call(xAxis);

//tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "m-graph-tooltip")
    .style("opacity", 0);

//draw dots
svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 2)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)
             .style("opacity", 1);
        tooltip.html( "<div class='wrapper'><p class='score'>" +d.score+ "<p/><p class='year'>" +parseYear(new Date(d.year))+ "</p></div>" )
             .style("left", (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
             .duration(500)
             .style("opacity", 0);
    });

  svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

  if(loader) {
    $el.removeClass(loader);
  }
};

module.exports = LineChart;
