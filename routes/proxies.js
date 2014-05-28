var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var router = require('express').Router()
var authCheck = require('../middleware/auth-check')
var proxyOwnerCheck = require('../middleware/proxy-owner-check')
var db = require('../db')


// list of all proxies
router.get('/'
, function (req, res) {
    var sql = 'SELECT * FROM proxies'

    db.query(sql, function (error, rows, result) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(200, rows)
    })
  }
)


// get single proxies
router.get('/:id'
, function (req, res) {
    var sql = 'SELECT * FROM proxies WHERE id = $1'
    var values = [req.params.id]

    db.query.first(sql, values, function (error, row) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(200, row)
    })
  }
)


// create proxy
router.post('/'
, authCheck
, function (req, res) {
    var sql = 'INSERT INTO proxies '
      + '("userId", "name", "description", "documentation", "subdomain", "url", "middleware") '
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    var values = [
      req.user.id
    , req.body.name
    , req.body.description || null
    , req.body.documentation || null
    , req.body.subdomain
    , req.body.url
    , JSON.stringify(req.body.middleware || [])
    ]

    db.query.first(sql, values, function (error, row) {
      if (error) return console.error(error.stack), res.send(500)
      return res.json(201, row)
    })
  }
)


// modify proxy that you are authorized to modify
router.patch('/:id'
, authCheck
, proxyOwnerCheck
, function (req, res) {
    return res.send(200)
  }
)


// delete proxy that you are authorized to modify
router.delete('/:id'
, authCheck
, proxyOwnerCheck
, function (req, res) {
    var sql = 'DELETE FROM proxies WHERE id = $1'
    var values = [req.params.id]

    db.query(sql, values, function (error, row, result) {
      if (error) return console.error(error.stack), res.send(500)
      return res.send(200)
    })
  }
)


// start your proxy
router.post('/:id/start'
, authCheck
, function (req, res) {
    // check if docker container is running
    // if not running, start it, else ignore
    // if already running ignore
    return res.send(200)
  }
)


// stop your proxy
router.post('/:id/stop'
, authCheck
, function (req, res) {
    // check if docker container is running
    // if so stop it, else ignore
    return res.send(200)
  }
)


// restart your proxy
router.post('/:id/restart'
, authCheck
, function (req, res) {
    // check if docker container is running
    // if so stop it and start it else start it
    return res.send(200)
  }
)

module.exports = router