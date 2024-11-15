import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    select,
    line,
    curveCardinal,
    scaleLinear,
    scaleTime,
    axisBottom,
    axisLeft,
    pointer,
    bisector,
    timeHour,
} from "d3";

function LineChartDetail({ id, days, width, height }) {
    const [data, setData] = useState([]);
    const svgRef = useRef();

    // Fetch data function memoized to avoid recreation
    const fetchData = useCallback(async () => {
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
    }, [id, days]); // Dependencies for fetchData

    // Fetch data only once or when id/days change
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Add fetchData as a dependency

    useEffect(() => {
        // Check if data is an array and contains elements before rendering
        if (!Array.isArray(data) || data.length === 0) return;

        // Clear any previous SVG elements
        select(svgRef.current).selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        // Set up SVG dimensions
        const svg = select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr(
                "style",
                "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;"
            )
            .style("-webkit-tap-highlight-color", "transparent")
            .style("overflow", "visible")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .on("pointerenter pointermove", pointermoved)
            .on("pointerleave", pointerleft)
            .on("touchstart", (event) => event.preventDefault());

        const adjustedWidth = width - margin.left - margin.right;
        const adjustedHeight = height - margin.top - margin.bottom;
        const color = data.at(-1).y - data.at(0).y > 0 ? "green" : "red";
        const xScale = scaleTime()
            .domain([new Date(data.at(0).x), new Date(data.at(-1).x)])
            .range([0, adjustedWidth + margin.left]);

        const yScale = scaleLinear()
            .domain([
                Math.min(...data.map((d) => d.y)),
                Math.max(...data.map((d) => d.y)),
            ])
            .range([adjustedHeight, 0]);

        const xAxis = axisBottom()
            .ticks(timeHour.every(3), "%I %p")
            .tickSizeOuter(0)
            .scale(xScale);
        const yAxis = axisLeft().scale(yScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${adjustedHeight})`)
            .call(xAxis);
        svg.append("g")
            .attr("transform", `translate(${-5},0)`)
            .call(yAxis)
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                    .selectAll(".tick line")
                    .clone()
                    .attr("x2", adjustedWidth)
                    .attr("stroke-opacity", 0.1)
            )
            .call((g) =>
                g
                    .append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
            );

        const myLine = line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(curveCardinal);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", color)
            .style("stroke-width", 1.2);

        const tooltip = svg.append("g");

        function formatValue(value) {
            return value.toLocaleString("en", {
                style: "currency",
                currency: "USD",
            });
        }

        function formatDate(date) {
            let options = {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };
            return new Date(date).toLocaleString("en-US", options);
        }

        const bisect = bisector((d) => d.x).center;
        function pointermoved(event) {
            const i = bisect(data, xScale.invert(pointer(event)[0]));
            tooltip.style("display", null);
            tooltip.attr(
                "transform",
                `translate(${xScale(data[i].x)},${yScale(data[i].y)})`
            );

            const path = tooltip
                .selectAll("path")
                .data([null])
                .join("path")
                .attr("fill", "white")
                .attr("stroke", "black");

            const text = tooltip
                .selectAll("text")
                .data([null])
                .join("text")
                .call((text) =>
                    text
                        .selectAll("tspan")
                        .data([formatDate(data[i].x), formatValue(data[i].y)])
                        .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_, i) => `${i * 1.1}em`)
                        .attr("font-weight", (_, i) => (i ? null : "bold"))
                        .text((d) => d)
                );

            size(text, path);
        }

        function pointerleft() {
            tooltip.style("display", "none");
        }

        function size(text, path) {
            const { y, width: w, height: h } = text.node().getBBox();
            text.attr("transform", `translate(${-w / 2},${y - 20})`);
            path.attr(
                "d",
                `M${-w / 2 - 10},-5H-5l5,5l5,-5H${w / 2 + 10}v-${h + 20}h-${
                    w + 20
                }z`
            );
        }
    }, [data, width, height]);

    return (
        <div style={{ alignSelf: "center" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default LineChartDetail;
