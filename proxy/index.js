// Module dependencies

var config = require('../config')
var Promise = require('bluebird')
var npm = Promise.promisifyAll(require('npm'))
var http = require('http')
var urlParser = require('url').parse
var zlib = require('zlib')
var request = require('request')
var Modifier = require('./modifier')

// proxy server w/ middleware
var proxy = function(middleware) {
  return new Promise(function (resolve, reject) {
    http.createServer(function (req, res) {
      var modifier = new Modifier({middleware: middleware || []})
      var url = config.url + (urlParser(req.url).search || '')

      var r = request({
        method: req.method.toLowerCase()
      , url: url
      , encoding: null
      }, function (error, response, body) {

        // copy headers
        for (var header in response.headers) {
          if (response.headers.hasOwnProperty(header)) {
            res.setHeader(header, response.headers[header])
          }
        }

        // res.setHeader('content-encoding', '')
        if (response.headers['content-encoding'] === 'gzip') {
          zlib.gunzip(body, function (error, buffer) {
            var data = null;
            if (buffer) data = buffer.toString()

            // run through middleware here
            // finally do this
            zlib.gzip(new Buffer(data), function (error, buffer) {
              res.end(buffer)
            })
          })
        } else {
          // run through middleware here
          // finally do this
          res.end(body)
        }
      })

      req.pipe(r)

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