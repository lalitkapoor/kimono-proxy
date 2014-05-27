// Module dependencies

var db = require('../db')
var querybox = require('querybox')

// TODO: write proper migration tool later

var pathToQueriesDirectory = __dirname + '/../db/deltas'
var box = querybox(pathToQueriesDirectory, db.query)

box.run('0.0.1', [], function (error) {
  if (error) return process.exit(1)
  return process.exit(0)
})