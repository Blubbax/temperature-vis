linePlotCreated = false;
linePlotAxesCreated = false;

var lineChartXScale;
var lineChartYScale;

function resizeLineChart() {
  var svg = d3.select("div#linechart-visualization").select('svg');

  var width = parseInt(d3.select("div#linechart-visualization").style('width'), 10)
  var height = parseInt(d3.select("div#linechart-visualization").style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}


function drawLineChart(data) {
  console.log("js")
  console.log(data)
  // Inspired by https://d3-graph-gallery.com/graph/line_several_group.html
  // update function inpired by https://jonsadka.com/blog/how-to-create-live-updating-and-flexible-d3-line-charts-using-pseudo-data/


  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 30 };

  var width = parseInt(d3.select("div#linechart-visualization").style('width'), 10) - margin.left - margin.right;
  var height = parseInt(d3.select("div#linechart-visualization").style('height'), 10) - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg;
  if (linePlotCreated) {
    svg = d3.select("div#linechart-visualization")
  } else {
    svg = d3.select("div#linechart-visualization")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    linePlotCreated = true;
  }

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.stationId); // nest function allows to group the calculation per level of a factor
  console.log(sumstat)

  lineChartXScale = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.date; }))
    .range([0, width]);

  lineChartYScale = d3.scaleLinear()
    .domain([d3.min(data, function (d) { return +d.temperature; }), d3.max(data, function (d) { return +d.temperature; })])
    .range([height, 0]);

  var xAxis = d3.axisBottom(lineChartXScale);
  var yAxis = d3.axisLeft(lineChartYScale);

  if (!linePlotAxesCreated) {

    // Add X axis --> it is a date format
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "x axis")
      .call(xAxis);

    // Add Y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    linePlotAxesCreated = true;
  } else {
    svg.selectAll(".x.axis").transition().duration(1500).call(xAxis);
    svg.selectAll(".y.axis").transition().duration(1500).call(yAxis);
  }

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

  // svg.selectAll(".line").remove();

  var lines = svg.selectAll(".line")
    .data(sumstat)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d[0]) });

  var line = (d) => d3.line()
    .x(function (d) { return lineChartXScale(d.date); })
    .y(function (d) { return lineChartYScale(+d.temperature); })
    (d[1]);

  // transition from previous paths to new paths
  lines.transition().duration(1500)
    .attr("d", line)

  lines.enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d[0]) })
    .attr("d", line);

  // exit
  lines.exit()
    .remove();





  // // Draw the line
  // svg.selectAll(".line")
  //   .data(sumstat)
  //   .join("path")
  //   .attr("class", "line")
  //   .attr("fill", "none")
  //   .attr("stroke", function (d) { return color(d[0]) })
  //   .attr("stroke-width", 1.5)
  //   .attr("d", function (d) {
  //     return d3.line()
  //       .x(function (d) { return x(d.date); })
  //       .y(function (d) { return y(+d.temperature); })
  //       (d[1]);
  //   })

  // console.log("After line creation")
  // console.log(svg.selectAll(".line"))



}
