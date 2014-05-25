// Module dependencies

var config = require('../config')
var _ = require('lodash')
var util = require('util')
var Promise = require('bluebird')
var Transform = require('stream').Transform

var Modifier = function (options) {
  if (!(this instanceof Modifier)) return new Modifier(options)
  Transform.call(this, options)

  this.middleware = options.middleware
}

util.inherits(Modifier, Transform)

Modifier.prototype.middleware = [] // array of middleware to apply

Modifier.prototype._transform = function (chunk, encoding, callback) {
  var data = JSON.parse(chunk.toString())
  var results = data.results // replace this before pushing+callingback

  this.push(chunk, encoding)
  callback()
}

module.exports = Modifier