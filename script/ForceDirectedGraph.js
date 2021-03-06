
function drawFDG() {
    var w = 250;
    var h = 800;

    var fdg = d3.select(".fdg")

        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "vertical-align: top;");
    var simulation;


    var color = d3.scaleOrdinal(d3.schemeCategory20);
    fdg.selectAll("g").remove()

    fdg.append("text").text("Collaboration Graph").attr("x", 0).attr("y", 50).attr("font-size", 25);
    var graph = {
        nodes: [],
        links: []
    }
    
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(w / 2, h / 2));


    getGraphOfCollaboration().then(results => {
        console.log(results)
        graph.links = results[0]
        graph.nodes = results[1]

        var link1 = fdg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
        link1.exit().remove()
        var link = link1.enter().append("line")
            .attr("stroke", "rgb(0,0,0)")
            .attr("stroke-width", function (d) { return d.value * 0.1; });

        var node1 = fdg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
        node1.exit().remove()
        var node = node1.enter().append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                if (d.type === "design") {
                    return "#d7191c"
                } else if (d.type === "comp") {
                    return "#fdae61"
                } else if (d.type === "external") {
                    return "#abd9e9"
                } else if (d.type === "alien"){
                    return "#2c7bb6"
                }
            });

        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links)

        var legend = fdg.append("g")

        legend.append("rect")
                .attr("width", 30)
                .attr("height", 30)
                .attr("style", "fill:#d7191c")
                .attr("y",h-250);

        legend.append("text")
                .text("design")
                .attr("x",50)
                .attr("y",h-225)
                .attr("font-size",25);

        legend.append("rect")
                .attr("width", 30)
                .attr("height", 30)
                .attr("style", "fill:#fdae61")
                .attr("y",h-200);

        legend.append("text")
                .text("comp")
                .attr("x",50)
                .attr("y",h-175)
                .attr("font-size",25)

        legend.append("rect")
                .attr("width", 30)
                .attr("height", 30)
                .attr("style", "fill:#abd9e9")
                .attr("y",h-150)

        legend.append("text")
                .text("external")
                .attr("x",50)
                .attr("y",h-125)
                .attr("font-size",25)

        
        legend.append("rect")
                .attr("width", 30)
                .attr("height", 30)
                .attr("style", "fill:#2c7bb6")
                .attr("y",h - 100)
        
        legend.append("text")
                .text("alien")
                .attr("x",50)
                .attr("y",h-75)
                .attr("font-size",25)
            

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }
        function dragstarted(d) {
            console.log("start")
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            console.log("dragging")
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            console.log("end")
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }



    })
}