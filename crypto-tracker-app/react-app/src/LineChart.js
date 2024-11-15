import React, { useRef, useEffect } from "react";
import { select, line, curveCardinal, scaleLinear } from "d3";

function LineChart(props) {
    const svgRef = useRef();

    useEffect(() => {
        const data = props.data || [];
        // Check if data is an array and contains elements before rendering
        if (!Array.isArray(data) || data.length === 0) return;

        // Clear any previous SVG elements
        select(svgRef.current).selectAll("*").remove();

        // Set up SVG dimensions
        const svg = select(svgRef.current)
            .attr("width", props.width)
            .attr("height", props.height);

        // Define margin and adjusted dimensions
        const margin = { top: 10, right: 5, bottom: 10, left: 20 };
        const adjustedWidth = props.width - margin.left - margin.right;
        const adjustedHeight = props.height - margin.top - margin.bottom;

        // Append a group element for the chart
        const chartGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Define scales
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([0, adjustedWidth]);

        const yScale = scaleLinear()
            .domain([
                Math.min(...data.map((d) => d.y)),
                Math.max(...data.map((d) => d.y)),
            ])
            .range([adjustedHeight, 0]);

        // Line generator
        const myLine = line()
            .x((d, i) => xScale(i))
            .y((d) => yScale(d.y))
            .curve(curveCardinal);

        // Draw the line
        chartGroup
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", props.color);
    }, [props.data, props.width, props.height, props.color]); // Re-run only if these dependencies change

    return <svg ref={svgRef}></svg>;
}

export default LineChart;
