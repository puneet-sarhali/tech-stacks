"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "../../config/testData";
import { getRepoStars } from "./fetchRepoStars";
import { formatNumber } from "../utils/formatNumber";
import { capitalizeWords } from "../utils/capitalizeWord";
import Link from "next/link";

export default function D3() {
  const svgRef = useRef(null);
  useEffect(() => {
    chart(svgRef);
  }, []);

  return (
    <div
      className="relative bg-[#191C21] w-screen h-screen"
      style={{ backgroundImage: "url('/dotted.svg')" }}
    >
      <div className="absolute top-8 left-8 p-4 bg-zinc-800 rounded-md">
        <h1 className=" text-neutral-400">
          Tree visualization of popular open source projects
        </h1>
        <Link
          href={"https://github.com/puneet-sarhali/tech-stacks"}
          target="_blank"
          className="text-neutral-300 underline"
        >
          Add new projects - Github <span>&#8599;</span>
        </Link>
      </div>

      <svg ref={svgRef} className="z-20"></svg>
    </div>
  );
}

const chart = async (svgRef) => {
  const dx = 45;
  const dy = 250;
  const width = 1500;
  const height = 1200;
  const margin = { top: 50, right: 50, bottom: 50, left: 150 };
  const bgColor = "#191C21";
  const borderColor = "#545864";
  const linkColor = "#545864";
  const textColor = "#fff";
  const rect = { width: 160, height: 35, rx: 5, ry: 5 };

  const root = d3.hierarchy(data);
  await fetchStars(root);
  root.sort((a, b) => b.stars - a.stars);
  const diagonal = d3
    .linkHorizontal()
    .source((d) => [d.source.y + 80, d.source.x])
    .target((d) => [d.target.y - 80, d.target.x]);

  const tree = d3.tree().nodeSize([dx, dy]);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth >= 1 && d.data.name !== "frontend") d.children = null;
    console.log(d);
  });

  if (!svgRef) return;
  const svg = d3.select(svgRef.current);

  svg
    .attr("viewBox", [-margin.left, -margin.right, width, height])
    .attr("width", "1500")
    .attr("height", "2000")
    .attr("style", "max-width: 100%; max-height: 100%;")
    .attr("font-size", 14)
    .attr("font-color", textColor)
    .attr("class", "drawarea");

  const g = svg.append("g");

  const zoomBehaviors = d3
    .zoom()
    .scaleExtent([0.05, 3])
    .on("zoom", () => g.attr("transform", d3.zoomTransform(svg.node())));

  svg.call(zoomBehaviors);

  // Append the filter element to the SVG
  const filter = svg
    .append("defs")
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("x", -60)
    .attr("y", -20)
    .attr("width", 1.2)
    .attr("height", 1.2);

  filter
    .append("feDropShadow")
    .attr("dx", 2)
    .attr("dy", 4)
    .attr("stdDeviation", 4)
    .attr("flood-opacity", 0.5);

  const gLink = g
    .append("g")
    .attr("fill", "none")
    .attr("stroke", linkColor)
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
      .on("click", (d) => {
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
        d.data.name.length > 12 ? d.data.name.length * 8 + 80 : 160
      )
      .attr("height", (d) => (d.stars !== "" ? 40 : 40))
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", bgColor)
      .attr("stroke", borderColor)
      .attr("stroke-width", 0.8)
      .attr("stroke-dasharray", (d) => (d._children ? "" : "3,3"))
      .style("cursor", (d) => (d._children ? "pointer" : "default"));

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("font-size", 12)
      .attr("x", -15)
      .attr("y", 0)
      .attr("text-anchor", "start")
      .html(
        (d) =>
          `
          <tspan style="fill: #f3f4f6; font-size: 12">${capitalizeWords(
            d.data.name
          )}</tspan>
          <tspan dx="0.5em" style="fill: #a3a3a3; font-size: 10; margin-left: 5px;">${
            d.stars ? "&#9733; " + formatNumber(d.stars) : ""
          }</tspan>`
      )
      .clone(true)
      .lower()
      .attr("fill", textColor)
      .style("cursor", (d) => (d._children ? "pointer" : "default"))
      .style("font-weight", "extra-bold");

    nodeEnter
      .append("circle")
      .attr("cx", -39) // Adjust the cx value as needed
      .attr("cy", 0) // Adjust the cy value as needed
      .attr("r", 14) // Adjust the radius value as needed
      .style("fill", "#f3f4f6"); // Adjust the fill color as needed

    nodeEnter
      .append("svg:image")
      .attr("x", -50)
      .attr("y", -11)
      .attr("width", 22)
      .attr("height", 22)
      .attr("xlink:href", (d) => d.data.iconPath)
      .style("cursor", (d) => (d._children ? "pointer" : "default"));

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
    // .attr("stroke", (d) =>
    //   d.source.data.name === "react" ? "#6ee7b7" : "#a3a3a3"
    // );

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
  update(root);

  return svg.node();
};

async function fetchStars(node) {
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
      const promise = fetchStars(child);
      fetchPromises.push(promise);
    }
  }

  await Promise.all(fetchPromises);
}
