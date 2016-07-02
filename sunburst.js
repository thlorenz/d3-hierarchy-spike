'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, false))
}
const d3 = window.d3
const graph = require('./sample-graph.js')
const width = 1400
const height = 800
const radius = Math.min(width, height) / 2

const svg = d3.select('.sunburst').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height * 0.52 + ')')

function sumAllocs(d) {
  function add(acc, alloc) {
    return acc + (alloc.count * alloc.size)
  }
  return d.allocations.reduce(add, 0)
}

function getChildren(d) {
  return d.children
}

function getSize(d) {
  // hardcoded 100000 here .. in the realworld we'd have to determine that value
  return Math.max(sumAllocs(d) / 100000, 2.5)
}

const partition = d3.layout.partition()
  .size([ 2 * Math.PI, radius * radius ])
  .children(getChildren)
  .value(getSize)

const arc = d3.svg.arc()
  .startAngle(d => d.x)
  .endAngle(d => d.x + d.dx)
  .innerRadius(d => Math.sqrt(d.y))
  .outerRadius(d => Math.sqrt(d.y + d.dy))

const color = d3.scale.category20c()
const nodes = partition.nodes(graph)

const g = svg.datum(graph).selectAll('g')
    .data(nodes)
    .enter()
      .append('g')

g.append('path')
  .attr('display', d => d.depth ? null : 'none') // hide inner ring
  .attr('d', arc)
  .style('stroke', '#fff')
  .style('fill', d => color((d.children ? d : d.parent).name))
  .style('fill-rule', 'evenodd')
  .on('mouseover', mouseover)
  .on('mouseout', mouseout)

// labels
g.selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .attr('id', 'tip')
  .attr('x', -100)
  .attr('y', 0)
  .attr('font-size', '11px')
  .style('opacity', 0)

function getLabel(d) {
  const parts = d.script_name.split('/')
  const shortScriptName = parts.slice(-2).join('/')
  return `${shortScriptName} (${d.name})`
}

function mouseover(d) {
  d3.select(this)
    .transition()
    .duration(1000)
    .ease('elastic')
    .style('opacity', 0.3)

  d3.select('#tip')
    .text(getLabel(d))
    .style('opacity', 0.9)
}

function mouseout(d) {
  d3.select(this)
    .transition()
    .duration(100)
    .style('opacity', 1)

  d3.select('#tip').style('opacity', 0)
}
