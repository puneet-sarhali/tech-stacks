"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { data } from "../../config/testData";
import { getRepoStars } from "./fetchRepoStars";
import { formatNumber } from "../utils/formatNumber";
import { capitalizeWords } from "../utils/capitalizeWord";
import { Rokkitt } from "next/font/google";

export default function D3() {
  const svgRef = useRef(null);
  useEffect(() => {
    chart(svgRef);
  }, []);

  return (
    <div
      className="relative bg-transparent w-screen h-screen"
      style={{ backgroundImage: "url('/dotted.svg')" }}
    >
      <svg ref={svgRef} className="z-20"></svg>
    </div>
  );
}

const chart = async (svgRef) => {
  const root = d3.hierarchy(data);
  await processHierarchy(root);
  console.log(root);
  root.sort((a, b) => b.stars - a.stars);
  console.log(root);
  const diagonal = d3
    .linkHorizontal()
    .x((d) => d.y - 10)
    .y((d) => d.x);

  const dx = 40;
  const dy = 300;
  const width = 1500;
  const height = 1200;
  const margin = { top: 50, right: 50, bottom: 50, left: 150 };
  const tree = d3.tree().nodeSize([dx, dy]);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth >= 1) d.children = null;
  });

  if (!svgRef) return;
  const svg = d3.select(svgRef.current);

  svg
    .attr("viewBox", [-margin.left, -margin.right, width, height])
    .attr("width", "1500")
    .attr("height", "2000")
    .attr(
      "style",
      "max-width: 100%; max-height: 100%; border: 1px solid #e5e5e5;"
    )
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
    .attr("class", "drawarea");

  const g = svg.append("g");

  const zoomBehaviours = d3
    .zoom()
    .scaleExtent([0.05, 3])
    .on("zoom", () => g.attr("transform", d3.zoomTransform(svg.node())));

  svg.call(zoomBehaviours);

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", "#f8fafc")
    .attr("stop-opacity", 0.2);

  gradient
    .append("stop")
    .attr("class", "middle")
    .attr("offset", "50%")
    .attr("stop-color", "yellow")
    .attr("stop-opacity", 1);

  gradient
    .append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 0.2);

  const gLink = g
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#737373")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 1.5);

  const gNode = g
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  function update(source) {
    const duration = 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore((node) => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Update the nodes…
    const node = gNode.selectAll("g").data(nodes, (d) => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (event, d) => {
        d.children = d.children ? null : d._children;
        update(d);
        if (d3.event && d3.event.altKey) {
          setTimeout(() => {
            //zoomToFit();
          }, duration + 100);
          //zoomToFit();
        }
      });

    nodeEnter
      .append("rect")
      .attr("x", -60)
      .attr("y", -20)
      .attr("width", (d) =>
        d.data.name.length > 10 ? d.data.name.length * 8 + 80 : 160
      )
      .attr("height", (d) => (d.stars !== "" ? 35 : 35))
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#fafafa")
      .attr("stroke", "#d4d4d4")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", (d) => (d._children ? "" : "3,3"))
      .style("cursor", (d) => (d._children ? "pointer" : "default"));

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("font-size", 12)
      .attr("x", -20)
      .attr("y", -3)
      .attr("text-anchor", "start")
      .html(
        (d) =>
          `${capitalizeWords(d.data.name)} <tspan style="fill: #a3a3a3;">${
            d.stars ? "&#9733; " + formatNumber(d.stars) : ""
          }</tspan>`
      )
      .clone(true)
      .lower()
      .attr("fill", "#262626")
      .style("cursor", (d) => (d._children ? "pointer" : "default"))
      .style("font-weight", "extra-bold");

    // nodeEnter
    //   .append("text")
    //   .attr("dy", "0.31em")
    //   .attr("font-size", 10)
    //   .attr("fill", "#737373")
    //   .attr("x", -20)
    //   .attr("y", 15)
    //   .attr("text-anchor", "start")
    //   .text((d) => (d.stars ? "★ " + formatNumber(d.stars) : ""))
    //   .clone(true)
    //   .lower()
    //   .style("cursor", (d) => (d._children ? "pointer" : "default"));

    nodeEnter
      .append("svg:image")
      .attr("x", -50)
      .attr("y", -15)
      .attr("width", 22)
      .attr("height", 22)
      .attr("xlink:href", (d) => d.data.iconPath)
      .style("cursor", (d) => (d._children ? "pointer" : "default"));

    // .attr("stroke-linejoin", "round")
    // .attr("stroke-width", 3)
    // .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", (d) => `translate(${d.y - 20},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", (d) => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path").data(links, (d) => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", (d) => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", (d) => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      });

    // Stash the old positions for transition.
    root.eachBefore((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // function zoomToFit(paddingPercent) {
  //   const bounds = svg.node().getBBox();
  //   const parent = svg.node().parentElement;
  //   const fullWidth = parent.clientWidth;
  //   const fullHeight = parent.clientHeight;

  //   const width = bounds.width;
  //   const height = bounds.height;

  //   const midX = bounds.x + width / 2;
  //   const midY = bounds.y + height / 2;

  //   if (width == 0 || height == 0) return; // nothing to fit

  //   const scale =
  //     (paddingPercent || 0.75) /
  //     Math.max(width / fullWidth, height / fullHeight);
  //   const translate = [
  //     fullWidth / 2 - scale * midX,
  //     fullHeight / 2 - scale * midY,
  //   ];

  //   const transform = d3.zoomIdentity
  //     .translate(translate[0], translate[1])
  //     .scale(scale);

  //   svg.transition().duration(500).call(zoomBehaviours.transform, transform);
  // }

  update(root);

  return svg.node();
};

async function processHierarchy(node) {
  const fetchPromises = [];

  if (node.data.repo) {
    const promise = getRepoStars(node.data.repo).then((stars) => {
      node.stars = stars;
    });
    fetchPromises.push(promise);
  } else {
    node.stars = "";
  }

  // Recursively process child nodes
  if (node.children) {
    for (const child of node.children) {
      const promise = processHierarchy(child);
      fetchPromises.push(promise);
    }
  }

  await Promise.all(fetchPromises);
}
