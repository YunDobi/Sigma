import Graph from 'graphology';
import Sigma from 'sigma';
import data from './data'
import ForceSupervisor from "graphology-layout-force"

const graph = new Graph();
const container = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const searchSuggest = document.getElementById('suggestions');
console.log(container);

graph.import(data);


const renderer = new Sigma(graph, container);
let draggedNode = "";
let isDragging = false;

renderer.on("downNode", (e) => {
  isDragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, "highlighted", true);
});

// Disable the autoscale at the first down interaction
renderer.getMouseCaptor().on("mousedown", () => {
  if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
});

renderer.getMouseCaptor().on("mousemovebody", (e) => {
  if (!isDragging || !draggedNode) return;

  // Get new position of node
  const pos = renderer.viewportToGraph(e);

  graph.setNodeAttribute(draggedNode, "x", pos.x);
  graph.setNodeAttribute(draggedNode, "y", pos.y);

  // Prevent sigma to move camera:
  e.preventSigmaDefault();
  e.original.preventDefault();
  e.original.stopPropagation();
});

renderer.getMouseCaptor().on("mouseup", () => {
  if (draggedNode) {
    graph.removeNodeAttribute(draggedNode, "highlighted");
  }
  isDragging = false;
  draggedNode = null;
});
