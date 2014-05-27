var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var router = require('express').Router()
var authCheck = require('../middleware/auth-check')
var middlewareOwnerCheck = require('../middleware/middleware-owner-check')
var db = require('../db')

router.all('*', authCheck)


// list of all middleware
router.get('/'
, function (req, res) {
    var sql = 'SELECT * FROM middleware'

    db.query(sql, function (error, rows, result) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(200, rows)
    })
  }
)


// get single middleware
router.get('/:id'
, function (req, res) {
    var sql = 'SELECT * FROM middleware WHERE id = $1'
    var values = [req.params.id]

    db.query.first(sql, values, function (error, row) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(200, row)
    })
  }
)

// create middleware
// Schema + contents: {"filename": "content"}
router.post('/'
, function (req, res) {
    var sql = 'INSERT INTO middleware ("userId", "name", "description", "type", "repo") '
            + 'VALUES ($1, $2, $3, $4, $5) RETURNING *'
    var values = [
      req.user.id
    , req.body.name
    , req.body.description
    , req.body.type
    , req.body.repo
    ]

    db.query.first(sql, values, function (error, row) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(201, row)
    })
  }
)


// modify middleware that you are authorized to modify
// create middleware-owner-check middleware
// create repo in user's github & add files
router.patch('/:id'
, middlewareOwnerCheck
, function (req, res) {
    return res.send(200)
  }
)


// delete middleware that you are authorized to modify
router.delete('/:id'
, middlewareOwnerCheck
, function (req, res) {
    var sql = 'DELETE FROM middleware WHERE id = $1'
    var values = [req.params.id]

    db.query(sql, values, function (error, row, result) {
      if (error) return console.error(error.stack), res.send(500)
      return res.send(200)
    })
  }
)

module.exports = router