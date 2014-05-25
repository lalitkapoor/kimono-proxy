// Module dependencies

var config = require('../config')
var Promise = require('bluebird')
var npm = Promise.promisifyAll(require('npm'))
var http = require('http')
var urlParser = require('url').parse
var request = require('request')
var Modifier = require('./modifier')

// proxy server w/ middleware
var proxy = function(middleware) {
  return new Promise(function (resolve, reject) {
    var modifier = new Modifier({middleware: middleware || []})
    http.createServer(function (req, res) {
      var url = config.url + (urlParser(req.url).search || '')
      var r = request[req.method.toLowerCase()](url)
      req.pipe(r).pipe(res)
    }).listen(config.proxyPort, function (error) {
      if (error) return reject(error)
      return resolve()
    })
  })
}

var middleware = []
// Example of middleware
/*
[
  {
    type: 'transform'
  , field: 'points'
  , middleware: 'lalitkapoor/kim-extract-integer'
  }
, {
    type: 'transform'
  , field: 'comments'
  , middleware: 'lalitkapoor/kim-extract-integer'
  }
, {
    type: 'transform'
  , field: 'title'
  , middleware: 'lalitkapoor/kim-translate-to-french'
  }
, {
    type: 'filter'
  , field: 'comments'
  , middleware: 'lalitkapoor/kim-filter-less-than'
  , args: [5]
  }
]
 */

// generate this list from the list of middleware
// var deps = ['lalitkapoor/kim-extract-integer']
var deps = []

npm.loadAsync({})
.then(function(data) { // install all required dependencies
  return new Promise(function (resolve, reject) {
    npm.commands.install(deps, function (error, data) {
      if (error) return reject(error)
      return resolve(data)
    })
  })
})
.then(proxy(middleware)) //launch proxy
.then(function () {
  console.log('launched proxy on port', config.proxyPort)
})
.catch(function (error) {
  if (error.stack) console.error(error.stack)
  process.exit(1)
})