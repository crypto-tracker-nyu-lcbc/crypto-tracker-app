import React, { useRef, useEffect, useState } from "react";
import {
    select,
    line,
    curveCardinal,
    scaleLinear,
    scaleTime,
    axisBottom,
    axisLeft,
} from "d3";

function LineChartDetail({ id, days, width, height, color }) {
    const [data, setData] = useState([]);
    const svgRef = useRef();

    // Fetch data from the API (only on component mount)
    const fetchData = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/historical-price-chart?id=${id}&days=${days}`
            );
            const result = await response.json();

            // Ensure the result is an array before setting data
            if (Array.isArray(result)) {
                setData(result);
            } else {
                console.error("Unexpected data format:", result);
                setData([]); // Fallback to empty array
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]); // Set data to empty array on error
        }
    };

    // Fetch data only once on component mount
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to fetch only once when the component mounts

    useEffect(() => {
        // Check if data is an array and contains elements before rendering
        if (!Array.isArray(data) || data.length === 0) return;

        // Clear any previous SVG elements
        select(svgRef.current).selectAll("*").remove();

        // Set up SVG dimensions
        const svg = select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // Define margin and adjusted dimensions
        const margin = { top: 30, right: 30, bottom: 30, left: 60 };
        const adjustedWidth = width - margin.left - margin.right;
        const adjustedHeight = height - margin.top - margin.bottom;

        // Append a group element for the chart
        const chartGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // x-axis Hourly data

        const d = new Date(data.at(0).x); // to GMT
        const to_d = new Date(data.at(-1).x);
        // Define scales
        const xScale = scaleTime().domain([d, to_d]).range([0, adjustedWidth]);

        const yScale = scaleLinear()
            .domain([
                Math.min(...data.map((d) => d.y)),
                Math.max(...data.map((d) => d.y)),
            ])
            .range([adjustedHeight, 0]);

        const xAxis = axisBottom().scale(xScale);
        const yAxis = axisLeft().scale(yScale);

        chartGroup
            .append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${adjustedHeight})`)
            .call(xAxis);

        chartGroup
            .append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end");

        // Line generator
        const myLine = line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(curveCardinal);

        // Draw the line
        chartGroup
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", color);
    }, [data, width, height, color]); // Re-run only if these dependencies change

    return (
        <svg ref={svgRef} style={{ float: "right", alignSelf: "center" }}></svg>
    );
}

export default LineChartDetail;
