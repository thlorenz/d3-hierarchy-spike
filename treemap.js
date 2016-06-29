'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, true))
}
const d3 = window.d3
const graph = require('./sample-graph.js')
const width = 180
const height = 600

function getChildren(d) {
  return d.children
}

const root = d3.hierarchy(graph, getChildren)

var treemap = d3.treemap()
    .size([width, height])
    .padding(2)

const nodes = treemap(root
    .sum(d => d.allocations.length)
    .sort((a, b) => b.height - a.height || b.depth - a.depth)
  )
  .descendants()

if (typeof window === 'undefined') {
  inspect(nodes)
} else {
  console.log(nodes)
  const color = d3.scale.category20()

  const svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
  svg.selectAll('.node')
      .data(nodes)
    .enter().append('rect')
      .attr('class', 'node')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('label', d => d.data.script_name + ':' + d.data.name)
      .style('fill', d => color(d.data.script_name))

  svg.selectAll('.label')
      .data(nodes)
    .enter().append('text')
      .attr('class', 'label')
      .attr('dy', '.35em')
      .attr('transform', d => 'translate(' + (d.x0) + ',' + (d.y0 + (d.y1 - d.y0) / 2) + ')')
      .text(d => d.data.script_name + ':' + d.data.name)
}
