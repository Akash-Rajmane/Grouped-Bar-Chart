import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./styles.css";

export default function App() {
  const svgRef = useRef(null);
  const data = [
    { month: "jan", income: 40000, expense: 15000 },
    { month: "feb", income: 20000, expense: 10000 },
    { month: "march", income: 40000, expense: 35000 }
  ];

  const findMax = (data) => {
    let maxIncome = Math.max(...data.map((el) => el.income));
    let maxExpense = Math.max(...data.map((el) => el.expense));
    if (maxIncome > maxExpense) {
      return maxIncome;
    } else {
      return maxExpense;
    }
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", "500")
      .attr("height", "420")
      .style("margin-bottom", "40")
      .style("margin-left", "40")
      .style("overflow", "visible");

    const xScale0 = d3.scaleBand().range([0, 400]).padding(0.2);
    const xScale1 = d3.scaleBand();
    const yScale = d3.scaleLinear().range([360, 0]);

    const xAxis = d3.axisBottom(xScale0).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(10).tickSizeOuter(0);

    xScale0.domain(data.map((d) => d.month));
    xScale1.domain(["income", "expense"]).range([0, xScale0.bandwidth()]);
    yScale.domain([0, findMax(data)]);

    const month = svg
      .selectAll(".month")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "month")
      .attr("transform", (d) => `translate(${xScale0(d.month)},0)`);

    /* Add income bars */
    month
      .selectAll(".bar.income")
      .data((d) => [d])
      .enter()
      .append("rect")
      .attr("class", "bar income")
      .style("fill", "green")
      .attr("x", (d) => xScale1("income"))
      .attr("y", (d) => yScale(d.income))
      .attr("width", xScale1.bandwidth())
      .attr("height", (d) => {
        return 360 - yScale(d.income);
      });

    /* Add expense bars */
    month
      .selectAll(".bar.expense")
      .data((d) => [d])
      .enter()
      .append("rect")
      .attr("class", "bar expense")
      .style("fill", "red")
      .attr("x", (d) => xScale1("expense"))
      .attr("y", (d) => yScale(d.expense))
      .attr("width", xScale1.bandwidth())
      .attr("height", (d) => {
        return 360 - yScale(d.expense);
      });

    // Add the X Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${360})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append("g").attr("class", "y axis").call(yAxis);
  }, []);
  return (
    <div>
      <h1>Grouped Bar Chart</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
}
