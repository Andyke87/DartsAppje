/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../Pages/styles/DartsBord.css';

const Border = ({ handleFieldClick, crosses }) => {
  const data = [
    { name: '20', value: 20, size: 50 },
    { name: '1', value: 1, size: 50 },
    { name: '18', value: 18, size: 50 },
    { name: '4', value: 4, size: 50 },
    { name: '13', value: 13, size: 50 },
    { name: '6', value: 6, size: 50 },
    { name: '10', value: 10, size: 50 },
    { name: '15', value: 15, size: 50 },
    { name: '2', value: 2, size: 50 },
    { name: '17', value: 17, size: 50 },
    { name: '3', value: 3, size: 50 },
    { name: '19', value: 19, size: 50 },
    { name: '7', value: 7, size: 50 },
    { name: '16', value: 16, size: 50 },
    { name: '8', value: 8, size: 50 },
    { name: '11', value: 11, size: 50 },
    { name: '14', value: 14, size: 50 },
    { name: '9', value: 9, size: 50 },
    { name: '12', value: 12, size: 50 },
    { name: '5', value: 5, size: 50 },
  ];
  const data2 = [
    { name: 25, value: 25, size: 50 },
  ];
  const data3 = [
    { name: 50, value: 50, size: 50 },
  ];

  const width = 850;
  const height = Math.min(width, 850);
  const radius = Math.min(width, height) / 2;

  const arc = d3.arc()
    .innerRadius(radius * 0)
    .outerRadius(radius - 1);

  const pie = d3.pie()
    .padAngle(0.2 / radius)
    .sort(null)
    .value(d => d.size);

  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const ringGroups = [
      { data: data, scale: 1, colors: [], stroke: 'black', titleMultiplier: 0 },
      { data: data, scale: 0.8, colors: ['red', 'green'], stroke: 'black', titleMultiplier: 2 },
      { data: data, scale: 0.74, colors: ['black', 'white'], stroke: 'black', titleMultiplier: 1 },
      { data: data, scale: 0.48, colors: ['red', 'green'], stroke: 'black', titleMultiplier: 3 },
      { data: data, scale: 0.42, colors: ['black', 'white'], stroke: 'black', titleMultiplier: 1 },
      { data: data2, scale: 0.10, colors: ['green'], stroke: 'black', titleMultiplier: 1 },
      { data: data3, scale: 0.05, colors: ['red'], stroke: 'black', titleMultiplier: 1 },
    ];

    ringGroups.forEach(({ data, scale, colors, stroke, titleMultiplier }, index) => {
      const g = svg.append("g");

      g.selectAll()
        .data(pie(data))
        .join("path")
        .attr("fill", d => data.indexOf(d.data) % 2 === 0 ? colors[0] : colors[1])
        .attr("d", arc)
        .attr("transform", `translate(0, 0) scale(${scale}) rotate(-10)`)
        .attr("stroke-width", 5)
        .attr("stroke", stroke)
        .on("click", (event, d) => {
          handleFieldClick(d.data.value * titleMultiplier)})
        .append("title")
        .text(d => `${d.data.value * titleMultiplier}`);

      if (index === 0) { // Index 0 verwijst naar de buitenste ring
        const textSize = 50; // Dit is de grootte van de tekst in de buitenste ring
        const ringRadius = radius * 0.9; // Pas deze waarde aan om de diameter van de cirkel te vergroten

        const outerRing = g.append("g")
          .attr("transform", "rotate(-10)"); // Pas de rotatie hier aan

        outerRing.selectAll()
          .data(pie(data))
          .join("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", ringRadius)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 5);

        outerRing.selectAll()
          .data(pie(data))
          .join("text")
          .text(d => `${d.data.name}`)
          // hier wordt de rotatie van de tekst aangepast om hun eigen as
          .attr("transform", d => `translate(${ringRadius * Math.sin(d.startAngle + (d.endAngle - d.startAngle) / 2)}, ${-ringRadius * Math.cos(d.startAngle + (d.endAngle - d.startAngle) / 2)}) rotate(8)`)
          .attr("text-anchor", "middle")
          .attr("dy", d => {
            const yOffset = 15; // Pas deze waarde aan op basis van je behoeften
            return yOffset;
          })
          .attr("font-size", textSize)
          .attr("font-family", "sans-serif")
          .attr("font-weight", "bold")
          .style("fill", "white");
      }
    });
  }, [data, data2, data3, width, height, arc, pie, svgRef, handleFieldClick]);

  return <svg ref={svgRef} />;
};

export default Border;
