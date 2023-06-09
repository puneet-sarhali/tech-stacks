"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { data } from "../../config/testData"
import { d3Tree } from "../utils/d3";


export default function D3() {
  const svgRef = useRef(null);
  useEffect(() => {
    chart(svgRef)
  }, []);


  return (
    <div className="bg-gray-200">
      <svg
        ref={svgRef}
      ></svg>
    </div>
  );
}




const chart = (svgRef) => {
  const root = d3.hierarchy(data);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
  const dx = 50;
  const dy = 150
  const width = 1200
  const height = 1200
  const margin = ({top: 50, right: 50, bottom:50, left: 200})
  const tree  = d3.tree().nodeSize([dx, dy])

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth >= 1) d.children = null;
  });

  if(!svgRef) return;
  const svg = d3.select(svgRef.current);

    svg.attr("viewBox", [-margin.left, -margin.right, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14);

  const defs =  svg.append("defs")

  const gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  gradient.append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

  gradient.append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);

  const gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "url(#svgGradient)")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 3);

 

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("svg:image")
    .attr('x', 0)
    .attr('y', -15)
    .attr('width', 30)
    .attr('height', 30)
    .attr("xlink:href", d => d.data.iconPath)

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        // .attr("stroke-linejoin", "round")
        // .attr("stroke-width", 3)
        // .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y - 20},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);


    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          console.log(d)
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}