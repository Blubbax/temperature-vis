svgCreated = false;
tooltipCreated = false;
mapCreated = false;

var mapZoomTransformation;

function resizeMap() {
  var svg = d3.select("div#map-visualization").select('svg');

  var width = parseInt(d3.select("div#map-visualization").style('width'), 10)
  var height = parseInt(d3.select("div#map-visualization").style('height'), 10)

  svg.attr("width", width)
    .attr("height", height);
}

function drawLegend() {

  const colourScale = d3.scaleLinear()
    .domain([-24, -16, -8, 0, 8, 16, 24, 32, 40])
    .range(['#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f'])


  // Inpired by https://bl.ocks.org/Ro4052/caaf60c1e9afcd8ece95034ea91e1eaa
  const container = d3.select("div#legend");
  // const colourScale = d3.scaleLinear().domain([-24, -16, -8, 0, 8, 16, 24, 32, 40]).range(['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd']);
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

function drawMap(stationdata, temperatureMapping, selectedStations) {
  // Inpired by https://d3-graph-gallery.com/graph/bubblemap_circleFeatures.html

  this.figure = d3.select("div#map-visualization");

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


    // scaleAnomaly = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
    //   .domain([-24, -16, -8, 0, 8, 16, 24, 32, 40])
    // const color = scaleAnomaly.copy().range(['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd'])
    // const color = d3.scaleSqrt([-100, 0, 100], ["blue", "white", "red"])
    // const color = d3.scaleLinear().domain([-25, 40]).range(['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd'])
    const color = d3.scaleLinear()
      .domain([-24, -16, -8, 0, 8, 16, 24, 32, 40])
      .range(['#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f'])

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
        .style("fill-opacity", 1)
    }

    var mousemove = function (d) {
      var temperature = temperatureMapping.get(d.target.__data__.id);
      if (temperature == undefined) {
        return Tooltip
          .html(
            "<b>" + d.target.__data__.name + " (" + d.target.__data__.country + ")</b><br>" +
            "Elevation: " + d.target.__data__.elevation + " m<br>" +
            "Temperature: not available for the selected date<br>" +
            "Observations: not available for the selected date");
      } else {
        return Tooltip
          .html(
            "<b>" + d.target.__data__.name + " (" + d.target.__data__.country + ")</b><br>" +
            "Elevation: " + d.target.__data__.elevation + " m<br>" +
            "Temperature: " + temperature.temperature + " °C (" + String(temperature.month).padStart(2, '0') + " " + temperature.year + ")<br>" +
            "Observations: " + temperature.observations);
      }
    }

    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("fill-opacity", 0.8)
    }

    var click = function (d) {
      if (d3.select(this).style("stroke") == "none") {
        d3.select(this)
          .style("stroke", "black");

        const eventConnectionPoint = document.getElementById('map-visualization');
        eventConnectionPoint.dispatchEvent(new CustomEvent('map-select', { detail: d.target.__data__ }));

      } else {
        d3.select(this)
          .style("stroke", "none");

        const eventConnectionPoint = document.getElementById('map-visualization');
        eventConnectionPoint.dispatchEvent(new CustomEvent('map-unselect', { detail: d.target.__data__ }));
      }
    }

    var doubleClick = function (d) {
      d.preventDefault();

      console.log("doubledetected")

      g.selectAll("circle")
        .style("stroke", "none");

      d3.select(this)
        .style("stroke", "black");

      const eventConnectionPoint = document.getElementById('map-visualization');
      eventConnectionPoint.dispatchEvent(new CustomEvent('map-selectThis', { detail: d.target.__data__ }));
    }


    // Add circles:

    g.selectAll("circle").remove();

    const circles = g
      .selectAll("myCircles")
      .data(stationdata);

    circles
      .enter()
      .append('circle')
      .attr('class', 'myCircles')
      .merge(circles)
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      //.attr('transform', d => {if (mapZoomTransformation != undefined) {console.log(mapZoomTransformation); return mapZoomTransformation.transform}})
      .attr('transform', mapZoomTransformation)
      .attr("class", "myCircles")
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
        if (selectedStations.includes(d)) {
          return "black";
        }
      })
      .attr("stroke-width", 3)
      .attr("fill-opacity", .8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("contextmenu", doubleClick)
      .on("click", click)



    // svg
    //   .selectAll("myCircles")
    //   .data(stationdata)
    //   .join("circle")
    //   .attr("cx", d => projection([d.longitude, d.latitude])[0])
    //   .attr("cy", d => projection([d.longitude, d.latitude])[1])
    //   .attr("class", "myCircles")
    //   .attr("r", d => size(d.elevation))
    //   .style("fill", d => {
    //     var temperature = temperatureMapping.get(d.id);
    //     if (temperature == undefined) {
    //       return "white"
    //     } else {
    //       return color(temperature.temperature);
    //     }
    //   })
    //   .attr("stroke", d => {
    //     var temperature = temperatureMapping.get(d.id);
    //     if (temperature == undefined) {
    //       return "black"
    //     } else {
    //       return color(temperature.temperature);
    //     }
    //   })
    //   .attr("stroke-width", 3)
    //   .attr("fill-opacity", .9)
    //   .on("mouseover", mouseover)
    //   .on("mousemove", mousemove)
    //   .on("mouseleave", mouseleave)



    var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        mapZoomTransformation = event.transform
        g.selectAll('path')
          .attr('transform', event.transform);
        svg.selectAll('circle')
          .attr('transform', event.transform);
      });

    svg.call(zoom);
  })

}
