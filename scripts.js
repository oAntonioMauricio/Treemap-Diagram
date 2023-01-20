const w = 1300;
const h = 500;
const padding = 0;

// Create svg
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

// Get Json Data

Promise.all([
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
]).then(function ([data]) {

    console.log(data)

    // Give the data to this cluster layout:
    const root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([w, h])
        (root)

    // Colors for the genres
    let colors = {
        Action: "#e6194B",
        Adventure: "#3cb44b",
        Comedy: "#ffe119",
        Drama: "#4363d8",
        Animation: "#f58231",
        Family: "#42d4f4",
        Biography: "#911eb4",
    };

    function selectColor(input) {
        switch (input) {
            case "Action":
                return colors.Action;
                break;
            case "Adventure":
                return colors.Adventure
                break;
            case "Comedy":
                return colors.Comedy
                break;
            case "Drama":
                return colors.Drama
                break;
            case "Animation":
                return colors.Animation
                break;
            case "Family":
                return colors.Family
                break;
            case "Biography":
                return colors.Biography
                break;
            default:
                return "black"
        }
    }

    // TOOLTIPS
    tooltip = d3.select("#holder")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it.
    let mouseover = function (e, d) {
        tooltip
            .style("opacity", 0.9)
        tooltip
            .html(`${d.data.name}`)
            .attr("data-value", `${d.data.value}`)
    }

    let mousemove = function (e, d) {
        tooltip
            .html(`Name: ${d.data.name}</br>Category: ${d.data.category}</br>Value: ${d.data.value}`)
            .attr("data-value", `${d.data.value}`)
            .style("left", (d3.pointer(e, svg)[0]) + "px")
            .style("top", (d3.pointer(e, svg)[1]) + "px")
    }

    let mouseleave = function (e, d) {
        tooltip.style("opacity", 0)
    }

    // Draw the Rectangles
    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("class", "tile")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("fill", (d) => selectColor(d.data.category))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Draw the text
    svg
        .selectAll("foreignObject")
        .data(root.leaves())
        .join("foreignObject")
        .attr("x", function (d) { return d.x0 + 5 })
        .attr("y", function (d) { return d.y0 + 5 })
        .attr("fill", "black")
        .attr("width", (d) => d.x1 - d.x0 - 10)
        .attr("height", (d) => d.y1 - d.y0 - 15)
        .style("font-size", "10px")
        .text((d) => d.data.name)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Create svg for the legend
    const svgLegend = d3.select("#legend")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    // Scale for the legend
    let genres = ["Action", "Adventure", "Comedy", "Drama", "Animation", "Family", "Biography"];

    xGenresScale = d3.scaleBand()
        .domain(genres)
        .range([250, w - 250])

    let xGenresAxis = d3.axisBottom(xGenresScale)
        .tickSize(10)

    svgLegend.append("g")
        .attr("id", "x-genres-axis")
        .attr("transform", `translate(${0},${50})`)
        .call(xGenresAxis)
        .call(g => g.select(".domain").remove())

    // X Axis Labels Format
    svgLegend
        .selectAll("text")
        .attr("y", 17)
        .attr("font-size", 12)

    // Rects and text for the legend
    svgLegend
        .selectAll("rect")
        .data(genres)
        .join("rect")
        .attr("class", "legend-item")
        .attr('x', (d) => xGenresScale(d) + 10)
        .attr('y', 25)
        .attr("width", xGenresScale.bandwidth() - 20)
        .attr("height", 20)
        .attr("fill", (d) => selectColor(d))
        .attr("margin", 20)

})