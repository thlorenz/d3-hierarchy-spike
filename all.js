'use strict'

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, true, depth || 5, false))
}

const xhr = require('xhr')
const initFlamegraph = require('./flamegraph')
const initSunburst = require('./sunburst')
const initTree = require('./tree')
const initTreemap = require('./treemap')

const graph = './flat.json'

function refresh() {
  xhr({ uri: graph, json: true }, ongraph)
  function ongraph(err, res, graph) {
    if (err) return console.error(err)
    initFlamegraph(graph, inspect)
    initSunburst(graph, inspect)
    initTree(graph, inspect)
    initTreemap(graph, inspect)
    console.log('refreshed')
  }
}

document.getElementById('refresh')
  .addEventListener('click', refresh)
refresh()
