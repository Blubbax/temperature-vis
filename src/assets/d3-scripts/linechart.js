var lineChartXScale;
var lineChartYScale;

function drawLinechartLegend(data) {

  // inspired by https://d3-graph-gallery.com/graph/custom_legend.html

  const stations = data.map(record => record.station);
  const uniqueStations = new Set(stations);


  const margin = { top: 10, right: 30, bottom: 30, left: 30 };
  const width = parseInt(d3.select("div#linechart-legend").style('width'), 10) - margin.left - margin.right - 35;
  const columns = Math.trunc(width / 200);
  const height = Math.trunc(uniqueStations.size / columns) * 25;

  d3.select("div#linechart-legend").select("svg").remove();
  var svg = d3.select("div#linechart-legend").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const color = d3.scaleOrdinal()
    //.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
    // .range(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'])
    .range(['#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#e41a1c'])


  var legendclick = function (d) {
    // Remove element from selection
    const eventConnectionPoint = document.getElementById('linechart-legend');
    eventConnectionPoint.dispatchEvent(new CustomEvent('linechart-unselect', { detail: d.target.__data__ }));
  }

  var legendrightClick = function (d) {
    // Remove element from selection
    const eventConnectionPoint = document.getElementById('linechart-legend');
    eventConnectionPoint.dispatchEvent(new CustomEvent('linechart-selectThis', { detail: d.target.__data__ }));
  }

  svg.selectAll("legenddots")
    .data(uniqueStations)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return 10 + ((i % columns) * 200) })
    .attr("cy", function (d, i) { return 10 + (Math.trunc(i / columns) * 25) })
    .attr("r", 7)
    .style("fill", function (d, i) {
      if (uniqueStations.size > 9) {
        return color(d.country);
      } else {
        return color(d.id);
      }
    })

  svg.selectAll("legendlabels")
    .data(uniqueStations)
    .enter()
    .append("text")
    .attr("x", function (d, i) { return 25 + ((i % columns) * 200) })
    .attr("y", function (d, i) { return 15 + (Math.trunc(i / columns) * 25) })
    // .style("fill", function (d, i) { return color(i) })
    .style("fill", "black")
    .text(function (d) { return d.name.substring(0, 20) })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("cursor", "pointer")
    .on("click", legendclick)
    .on("contextmenu", legendrightClick)


}

function resizeLineChart() {
  var svg = d3.select("div#linechart-visualization").select('svg');

  var width = parseInt(d3.select("div#linechart-visualization").style('width'), 10)
  var height = parseInt(d3.select("div#linechart-visualization").style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}

function drawLineChart(data, linReg) {
  // Inspired by https://d3-graph-gallery.com/graph/line_several_group.html
  // update function inpired by https://jonsadka.com/blog/how-to-create-live-updating-and-flexible-d3-line-charts-using-pseudo-data/


  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 50 };

  var width = parseInt(d3.select("div#linechart-visualization").style('width'), 10) - margin.left - margin.right;
  var height = parseInt(d3.select("div#linechart-visualization").style('height'), 10) - margin.top - margin.bottom;

  // append the svg object to the body of the page

  d3.select("div#linechart-visualization").select("svg").remove();

  var svg = d3.select("div#linechart-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.stationId); // nest function allows to group the calculation per level of a factor

  lineChartXScale = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.date; }))
    .range([0, width]);

  lineChartYScale = d3.scaleLinear()
    .domain([d3.min(data, function (d) { return +d.temperature; }), d3.max(data, function (d) { return +d.temperature; })])
    .range([height, 0]);

  var xAxis = d3.axisBottom(lineChartXScale)
    .tickFormat(d3.timeFormat("%Y"));

  var yAxis = d3.axisLeft(lineChartYScale);


  // Add X axis --> it is a date format
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x axis")
    .call(xAxis);

  // Add Y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Tooltip
  var Tooltip = d3.select("div#linechart-visualization")
    .append("div")
    .style("opacity", 0)
    .attr("class", "linechart-tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("right", "40px")
    .style("top", "40px");

    var mouseover = function (d) {
      Tooltip
        .style("opacity", 1);
    }

    var mousemoveDot = function (d) {
      Tooltip
        .html("<b>" + d.target.__data__.station.name + " (" + d.target.__data__.station.country + ")" + "</b><br>" +
        "Temperature: " + d.target.__data__.temperature + " °C<br>" +
        "Observations: " + d.target.__data__.observations + "<br>" +
        "Date: " + d.target.__data__.month + " " + d.target.__data__.year + "<br>");

      if (d.clientX > 980) {
        Tooltip
          .style("right", null)
          .style("left", "90px");
      } else {
        Tooltip
          .style("right", "40px")
          .style("left", null);
      }
    }

    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0);
    }


  // color palette
  const color = d3.scaleOrdinal()
    //.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
    // .range(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'])
    .range(['#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#e41a1c'])

  var line = (d) => d3.line()
    .x(function (d) { return lineChartXScale(d.date); })
    .y(function (d) { return lineChartYScale(+d.temperature); })
    (d[1]);

  // // draw the axis description
  // svg.append("text")
  //   .attr("x", -250)
  //   .attr("y", -15)
  //   .style("fill", "black")
  //   .text("Temperature in °C")
  //   .attr("text-anchor", "left")
  //   .attr("transform", "rotate(270)")
  //   .style("alignment-baseline", "middle")

  const uniqueStations = new Set(data.map(record => record.station));


  // Draw the line
  svg.selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .transition().duration(500).ease(d3.easeLinear)
    .attr("stroke", function (d) {
      if (uniqueStations.size > 9) {
        return color(d[1][0].station.country);
      } else {
        return color(d[0]);
      }
    })
    .attr("stroke-width", 1.5)
    .attr("d", line);

  svg.selectAll(".line")
    .append("title")
    .text(d => d[1][0].station.name + " (" + d[1][0].station.country + ")");

  var circles = svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) { return lineChartXScale(d.date) })
    .attr("cy", function (d) { return lineChartYScale(d.temperature) })
    .attr("class", "circle")
    .attr("r", 4)
    .attr('fill', function (d) {
      if (uniqueStations.size > 9) {
        return color(d.station.country);
      } else {
        return color(d.stationId);
      }
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemoveDot)
    .on("mouseleave", mouseleave);



  drawLinechartLegend(data);

  if (linReg) {

    const linearRegression = calcLinearRegression(data);

    var mousemoveLinReg = function (d) {
      Tooltip
        .html("<b>Linear Regression</b><br>" +
          "Slope: " + linearRegression[2]);

      if (d.clientX > 980) {
        Tooltip
          .style("right", null)
          .style("left", "90px");
      } else {
        Tooltip
          .style("right", "40px")
          .style("left", null);
      }
    }

    svg
      .append("line")
      .attr("x1", lineChartXScale(linearRegression[0][0]))
      .attr("y1", lineChartYScale(linearRegression[0][1]))
      .attr("x2", lineChartXScale(linearRegression[1][0]))
      .attr("y2", lineChartYScale(linearRegression[1][1]))
      .attr("class", "linReg")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .on("mouseover", mouseover)
      .on("mousemove", mousemoveLinReg)
      .on("mouseleave", mouseleave)
      .append("title")
      .text("slope: " + linearRegression[2]);
  }

}


function calcLinearRegression(data) {
  // Inspired by https://www.w3schools.com/ai/ai_regressions.asp

  var xArray = data.map(record => record.date.valueOf());
  var yArray = data.map(record => record.temperature);

  // Calculate Sums
  var xSum = 0, ySum = 0, xxSum = 0, xySum = 0;
  var count = xArray.length;
  for (var i = 0, len = count; i < count; i++) {
    xSum += xArray[i];
    ySum += yArray[i];
    xxSum += xArray[i] * xArray[i];
    xySum += xArray[i] * yArray[i];
  }

  // Calculate slope and intercept
  var slope = (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
  var intercept = (ySum / count) - (slope * xSum) / count;

  const x1 = d3.min(data, function (d) { return +d.date; })
  const x2 = d3.max(data, function (d) { return +d.date; })
  const y1 = x1 * slope + intercept;
  const y2 = x2 * slope + intercept;

  return [[new Date(x1), y1], [new Date(x2), y2], slope];
}
