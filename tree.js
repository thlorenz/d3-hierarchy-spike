'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, false))
}
const d3 = window.d3
const graph = require('./sample-graph.js')
const width = 1400
const height = 800

function getChildren(d) {
  return d.children
}

const root = d3.hierarchy(graph, getChildren)

const tree = d3.tree()
    .size([ height, width - 150 ])
tree(root)

const svg = d3.select('.tree').append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(40,0)')

// link paths
svg.selectAll('.link')
      .data(root.descendants().slice(1))
    .enter().append('path')
      .attr('class', 'link')
      .attr('d', function(d) {
        return 'M' + d.y + ',' + d.x
            + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
            + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
            + ' ' + d.parent.y + ',' + d.parent.x
      })

const node = svg.selectAll('.node')
    .data(root.descendants())
  .enter().append('g')
    .attr('class', function(d) { return 'node' + (d.children ? ' node--internal' : ' node--leaf') })
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')' })

function sumAllocs(d) {
  function add(acc, alloc) {
    return acc + (alloc.count * alloc.size)
  }
  return d.data.allocations.reduce(add, 0)
}

function getRadius(d) {
  // hardcoded 100000 here .. in the realworld we'd have to determine that value
  return Math.max(sumAllocs(d) / 100000, 2.5)
}

node.append('circle')
  .attr('r', getRadius)

node.append('text')
  .attr('dy', -15)
  .attr('x', d => d.children ? -8 : 8)
  .style('text-anchor', d => d.children ? 'end' : 'start')
  .text(d => d.data.script_id + ':' + d.data.name)
