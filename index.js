const kickstarterPledges = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
const movieSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
const videoGameSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
const data = [];

d3.queue()
    .defer(d3.json, kickstarterPledges)
    .defer(d3.json, movieSales)
    .defer(d3.json, videoGameSales)
    .await(ready);

function ready(error, kickstater, movies, videoGames) {
    if (error) console.log(error);
    data.push(kickstater);
    data.push(movies);
    data.push(videoGames);
    renderD3(kickstater);
}

const width = 932;
const height = 1060;
const color = d3.scaleOrdinal().range(d3.schemeCategory10);
const format = d3.format(",d")

treemap = data => d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.height - a.height || b.value - a.value))

function renderD3(dataSet) {

    const root = treemap(data);
  
    const svg = d3.select(DOM.svg(width, height))
        .style("width", "100%")
        .style("height", "auto")
        .style("font", "10px sans-serif");
  
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);
  
    leaf.append("rect")
        .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);
  
    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
      .append("use")
        .attr("xlink:href", d => d.leafUid.href);
  
    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
      .enter().append("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
  
  }