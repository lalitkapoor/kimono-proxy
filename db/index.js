// Module dependencies

var config = require('../config')
var pg = require('pg.js')
var pgQuery = require('pg-query')

// setup query with conn str
pgQuery.connectionParameters = config.pg.connStr

module.exports.query = pgQuery

module.exports.getClient = function (connStr, callback) {
  if (typeof(connStr) === 'function') {
    callback = connStr
    connStr = config.pg.connStr
  }
  pg.connect(connStr, callback)
}