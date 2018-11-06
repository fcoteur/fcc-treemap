var width = 960,
    height = 1060;

var format = d3.format(",d");

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
        .map(function(c) { 
            c = d3.rgb(c); 
            c.opacity = 0.6; 
            return c; 
        }));

var treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

var tooltip = d3.select("body")
    .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0);

function renderD3(data) {

    var root = d3.hierarchy(data)
        .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);
    
    d3.select("#chart").selectAll(".node")
        .data(root.leaves())
        .enter()
        .append("div")
            .attr("class", "node")
            .attr("title", d => d.data.id + "\n" + format(d.value))
            .style("left", d => d.x0 + "px")
            .style("top", d => d.y0 + "px")
            .style("width", d => d.x1 - d.x0 + "px")
            .style("height", d => d.y1 - d.y0 + "px")
            .style("background", d => {
                while (d.depth > 1) d = d.parent;
                return color(d.data.id); 
            })
            .on("mousemove", function(d) {    
                tooltip.style("opacity", .9); 
                tooltip.html(
                  'Name: ' + d.data.name + 
                  '<br>Category: ' + d.data.category + 
                  '<br>Value: ' + d.data.value
                )
                .attr("data-value", d.data.value)
                .style("left", (d3.event.pageX + 10) + "px") 
                .style("top", (d3.event.pageY - 28) + "px"); 
              })    
              .on("mouseout", function(d) { 
                tooltip.style("opacity", 0); 
              })
        .append("div")
            .attr("class", "node-label")
            .text(d => d.id)
        .append("div")
            .attr("class", "node-value")
            .text(d => d.data.name);

            
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
    renderD3(videoGames);
}