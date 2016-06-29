'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, true))
}
const d3 = require('d3-hierarchy')
const graph = require('./sample-graph.js')

function getChildren(d) {
  return d.children
}

const h = d3.hierarchy(graph, getChildren)
inspect(h)
