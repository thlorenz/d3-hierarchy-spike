'use strict'

const d3 = window.d3

module.exports = function initTree(graph, inspect) {
  const width = 1400
  const height = 1600
  const scale = 30
  let maxAllocs = 0

  function sumAllocs(d) {
    function add(acc, alloc) {
      return acc + (alloc.count * alloc.size)
    }
    d.data.allocSum  = d.data.allocations.reduce(add, 0)
    maxAllocs = Math.max(maxAllocs, d.data.allocSum)
  }

  function getChildren(d) {
    return d.children
  }

  const root = d3.hierarchy(graph, getChildren)
  root.each(sumAllocs)

  const tree = d3.tree()
      .size([ height, width - 150 ])
  tree(root)

  const svg = d3.select('.tree').append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(40,0)')

  const nodes = root.descendants()

  // link paths
  svg.selectAll('.link')
        .data(nodes.slice(1))
      .enter().append('path')
        .attr('class', 'link')
        .attr('d', function(d) {
          return 'M' + d.y + ',' + d.x
              + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
              + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
              + ' ' + d.parent.y + ',' + d.parent.x
        })

  const g = svg.selectAll('.node')
      .data(nodes)
      .enter()
        .append('g')

  g.attr('class', function(d) { return 'node' + (d.children ? ' node--internal' : ' node--leaf') })
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')' })

  function getRadius(d) {
    const r = Math.max(d.data.allocSum / maxAllocs * scale, 5)
    return Math.min(r, 120)
  }

  g.append('circle')
    .attr('r', getRadius)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

  g.append('text')
    .attr('dy', -15)
    .attr('x', d => d.children ? -8 : 8)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.name)

  // labels
  g.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('id', 'tip-tree')
    .attr('x', 0)
    .attr('y', -(height / 2))
    .style('opacity', 0)
    .style('white-space', 'pre')

  function getLabel(d) {
    return `[${d.allocSum}] (${d.name}) ${d.script_name}`
  }

  function mouseover(d) {
    d3.select(this)
      .transition()
      .duration(500)
      .ease('elastic')
      .style('opacity', 1)
      .style('cursor', 'pointer')

    d3.select('#tip-tree')
      .text(getLabel(d.data))
      .style('opacity', 0.9)
  }

  function mouseout(d) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('opacity', 0.7)

    d3.select('#tip-tree').style('opacity', 0)
  }
}
