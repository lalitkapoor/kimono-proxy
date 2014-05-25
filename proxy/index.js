// Module dependencies

var config = require('../config')
var npm = require('npm')
var http = require('http')
var request = require('request')
var Modifier = require('./modifier')

var modifier = new Modifier({middleware: []})

http.createServer(function (req, res) {
  var r = request[req.method.toLowerCase()](req.url)
  req.pipe(r)
  r.pipe(Modifier).pipe(res)
}).listen(config.proxyPort)