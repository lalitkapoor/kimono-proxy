// Module dependencies

var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var npm = Promise.promisifyAll(require('npm'))
var http = require('http')
var urlParser = require('url').parse
var zlib = require('zlib')
var request = require('request')
var async = require('async')
var middleware = require('./middleware.json')

// 1. get list of dependencies from middleware.json
// 2. install dependencies
// 3. map middleware.repo to a required function
// 4. server proxy server w/middleware support
//    1. accept request, proxy to original, get response
//    2. if request method is GET/POST/PUT/PATCH after response, run through middleware
//    3. respond to original request

// consider breaking out middleware handling component into its own file

var runMiddlewareTransform = function (ware, arr, callback) {
  console.log('transform', ware.repo)
  async.map(arr, function (item, cb) {
    var func = ware.func.apply(null, ware.args || [])
    func(item[ware.field], item, arr, function (error, value) {
      item[ware.field] = value
      cb(null)
    })
  }, function (error) {
    if (error) return callback(error)
    return callback(null)
  })
}

var runMiddlewareFilter = function (ware, arr, callback) {
  console.log('filter', ware.repo)
  async.filter(arr, function (item, cb) {
    // we want the user to be able to access the entire item if they need it
    var obj = {field: ware.field, item: item}
    var func = ware.func.apply(null, ware.args || [])
    func(obj, cb)
  }, function (results) {
    // overwrite the array that arr references
    arr.length = 0 // iterate and pop for best performance instead
    Array.prototype.push.apply(arr, results)
    return callback(null)
  })
}

var runMiddleware = function(middleware, arr, callback) {
  // ware is a single piece of middleware
  async.mapSeries(middleware, function (ware, cb) {
    console.log(ware.field)
    if (ware.type === 'transform') {
      runMiddlewareTransform(ware, arr[ware.collection], cb)
    } else if (ware.type === 'filter') {
      runMiddlewareFilter(ware, arr[ware.collection], cb)
    } else {
      cb(null)
    }
  }, function (error) {
    if (error) return callback(error)
    callback(null)
  })
}

// proxy server w/ middleware support
var proxy = function(middleware) {
  return new Promise(function (resolve, reject) {
    http.createServer(function (req, res) {
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
        res.removeHeader('etag') // prevent caching
        res.removeHeader('content-length') // prevent caching
        if (response.statusCode>= 200 && response.statusCode<300) {
          if (response.headers['content-encoding'] === 'gzip') {
            try {
              zlib.gunzip(body, function (error, buffer) {
                var data = null;
                if (buffer) data = JSON.parse(buffer.toString())
                runMiddleware(middleware, data.results, function (error) {
                  // re-encode
                  zlib.gzip(new Buffer(JSON.stringify(data)), function (error, buffer) {
                    res.end(buffer)
                  })
                })
              })
            } catch (error) { // error parsing json
              console.log(error.stack)
              res.end(body)
            }
          } else { // if content-encoding is not gzip
            try {
              var data = JSON.parse(body.toString())
              runMiddleware(middleware, data.results, function (error) {
                res.end(JSON.stringify(data))
              })
            } catch (error) { // error parsing json
              console.log(error.stack)
              res.end(body)
            }
          }
        } else { // if response.statusCode not between 200 and 300
          res.end(body)
        }
      })

      // console.log(req.url)
      // console.log(req.headers)
      req.pipe(r)

    }).listen(config.proxyPort, function (error) {
      if (error) return reject(error)
      return resolve()
    })
  })
}

var installWareDependencies = function (ware) {
  return new Promise(function (resolve, reject) {
    npm.load({}, function (error) {
      if (error) return reject(error)
      npm.commands.install([ware.repo], function (error, data) {
        if (error) return reject(error)
        var module = data.pop()[1].split('node_modules/')[1]
        ware.func = require(module)
        return resolve()
      })
    })
  })
}

var installMiddlewareDependencies = function (middleware) {
  var promises = middleware.map(function (ware) {
    return installWareDependencies(ware)
  })

  return Promise.all(promises)
}

installMiddlewareDependencies(middleware)
.then(proxy(middleware)) //launch proxy
.then(function () {
  console.log('launched proxy on port', config.proxyPort)
})
.catch(function (error) {
  if (error.stack) console.error(error.stack)
  process.exit(1)
})