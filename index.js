var width = 960,
    height = 1060;

var format = d3.format(",d");

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
        .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

var treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

function renderD3(data) {

    var root = d3.hierarchy(data)
    .eachBefore(function(d) {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; 
      })
      .sum(sumBySize)
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    treemap(root);
    d3.select("#chart").selectAll(".node")
        .data(root.leaves())
        .enter()
        .append("div")
            .attr("class", "node")
            .attr("title", function(d) { return d.id + "\n" + format(d.value); })
            .style("left", function(d) { return d.x0 + "px"; })
            .style("top", function(d) { return d.y0 + "px"; })
            .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            .style("height", function(d) { return d.y1 - d.y0 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })
        .append("div")
            .attr("class", "node-label")
            .text(function(d) { return d.id })
        .append("div")
            .attr("class", "node-value")
            .text(function(d) { return format(d.value); });
}

function sumBySize(d) {
    return d.value;
}
  

const kickstarterPledges = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
const movieSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
const videoGameSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
const dataSets = [];

d3.queue()
    .defer(d3.json, kickstarterPledges)
    .defer(d3.json, movieSales)
    .defer(d3.json, videoGameSales)
    .await(ready);

function ready(error, kickstater, movies, videoGames) {
    if (error) console.log(error);
    dataSets.push(kickstater);
    dataSets.push(movies);
    dataSets.push(videoGames);
    console.log(kickstater)
    renderD3(kickstater);
}