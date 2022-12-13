svgCreated = false;
tooltipCreated = false;
mapCreated = false;

function resizeMap() {
  var svg = d3.select("div#map-visualization").select('svg');

  var width = parseInt(d3.select("div#map-visualization").style('width'), 10)
  var height = parseInt(d3.select("div#map-visualization").style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}

function drawLegend() {
  // Inpired by https://bl.ocks.org/Ro4052/caaf60c1e9afcd8ece95034ea91e1eaa
  const container = d3.select("div#legend");
  const colourScale = d3.scaleLinear().domain([-25, 40]).range(["blue", "red"]);
  // const colourScale = d3
  //   .scaleSequential(d3.interpolateViridis)
  //   .domain([-25, 40]);
  const domain = colourScale.domain();

  const width = 100;
  const height = 150;

  const paddedDomain = fc.extentLinear()
    .pad([0.1, 0.1])
    .padUnit("percent")(domain);
  const [min, max] = paddedDomain;
  const expandedDomain = d3.range(min, max, (max - min) / height);

  const xScale = d3
    .scaleBand()
    .domain([0, 1])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain(paddedDomain)
    .range([height, 0]);

  const svgBar = fc
    .autoBandwidth(fc.seriesSvgBar())
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(0)
    .baseValue((_, i) => (i > 0 ? expandedDomain[i - 1] : 0))
    .mainValue(d => d)
    .decorate(selection => {
      selection.selectAll("path").style("fill", d => colourScale(d));
    });

  const axisLabel = fc
    .axisRight(yScale)
    .tickValues([...domain, (domain[1] + domain[0]) / 2])
    .tickSizeOuter(0);

  const legendSvg = container.append("svg")
    .attr("height", height)
    .attr("width", width);

  const legendBar = legendSvg
    .append("g")
    .datum(expandedDomain)
    .call(svgBar);

  const barWidth = Math.abs(legendBar.node().getBoundingClientRect().x);
  legendSvg.append("g")
    .attr("transform", `translate(${barWidth + 20})`)
    .datum(expandedDomain)
    .call(axisLabel)
    .select(".domain")
    .attr("visibility", "hidden");

  container.style("margin", "20px");
}

function drawMap(stationdata, temperatureMapping) {
  // Inpired by https://d3-graph-gallery.com/graph/bubblemap_circleFeatures.html

  this.figure = d3.select("div#map-visualization");

  var zoomTransformation;
  var width = parseInt(this.figure.style('width'), 10)
  var height = parseInt(this.figure.style('height'), 10)


  var svg;
  var g;
  if (svgCreated) {
    svg = this.figure
      .select("svg");
    g = svg.select("g");
  } else {
    svg = this.figure
      .append("svg")
    // .attr("width", width)
    // .attr("heigth", height);
    // .attr("viewBox", [0, 0, width, width])
    // .style("font", "18px sans-serif");
    g = svg.append("g");
    svgCreated = true;
  }

  svg.attr("width", width)
    .attr("height", height);

  // Map and projection
  const projection = d3.geoMercator()
    .center([10, 55])                // GPS of location to zoom on
    .scale(600)                       // This is like the zoom
    .translate([width / 2, height / 2]);


  // Load external data and boot
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

    // // Filter data
    // data.features = data.features//.filter(d => d.properties.name == "France")

    // Create a color scale
    // const color = d3.scaleOrdinal()
    //   .domain(["A", "B", "C"])
    //   .range(["#402D54", "#D18975", "#8FD175"])

    // const color = d3.scaleSqrt([-100, 0, 100], ["blue", "white", "red"])
    const color = d3.scaleLinear().domain([-25, 40]).range(["blue", "red"])

    // Add a scale for bubble size
    const size = d3.scaleLinear()
      .domain([0, 1200])  // What's in the data
      .range([4, 18])  // Size in pixel

    if (!mapCreated) {
      // Draw the map
      g.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .style("stroke", "black")
        .style("opacity", .3)

      mapCreated = true;
    }

    // Tooltip functions
    var Tooltip;
    if (tooltipCreated) {
      Tooltip = this.figure.select("div");
    } else {
      Tooltip = this.figure
        .append("div")
        .style("opacity", 0)
        .attr("class", "map-tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("right", "40px")
        .style("top", "40px")

      tooltipCreated = true;
    }

    var mouseover = function (d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function (d) {
      Tooltip
        .html(
          "<b>" + d.target.__data__.name + " (" + d.target.__data__.country + ")</b><br>" +
          "Elevation: " + d.target.__data__.elevation + " m<br>" +
          "Temperature: " + d.target.__data__.temperatures[0].temperature + " °C (" + String(d.target.__data__.temperatures[0].month).padStart(2, '0') + " " + d.target.__data__.temperatures[0].year + ")")

    }
    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }


    // Add circles:
    svg.selectAll("myCircles").remove();

    svg
      .selectAll("myCircles")
      .data(stationdata)
      .join("circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", d => size(d.elevation))
      .style("fill", d => {
        var temperature = temperatureMapping.get(d.id);
        if (temperature == undefined) {
          return "white"
        } else {
          return color(temperature.temperature);
        }
      })
      .attr("stroke", d => {
        var temperature = temperatureMapping.get(d.id);
        if (temperature == undefined) {
          return "black"
        } else {
          return color(temperature.temperature);
        }
      })
      .attr("stroke-width", 3)
      .attr("fill-opacity", .9)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)



    var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        zoomTransformation = event.transform
        g.selectAll('path')
          .attr('transform', event.transform);
        svg.selectAll('circle')
          .attr('transform', event.transform);
      });

    svg.call(zoom);
  })

}
