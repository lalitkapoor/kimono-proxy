var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var router = require('express').Router()
var authCheck = require('../middleware/auth-check')

router.all('*', authCheck)

router.get('/', function (req, res) {
  // list of all middleware (including other users)
  return res.send(200)
})

  // EXPOSED SCHEMA
  // {
  //   id: int
  // , name: string
  // , type: enum('transform', 'filter')
  // , repo: url // github repo
  // , documentation: string // ideally markdown
  // , userId: int // use github id
  // , username: string // use github username
  // , createdAt: timestamp w/timezone
  // }

router.post('/', function (req, res) {
  // create middleware
  // Schema + contents: {
  // "filename": "content"}
  return res.send(201)
})

router.patch('/:id', function (req, res) {
  // modify middleware that you are authorized to modify
  // create middleware-owner-check middleware
  // create repo in user's github & add files
  return res.send(200)
})

router.delete('/:id', function (req, res) {
  // delete middleware that you are authorized to modify
  return res.send(200)
})

module.exports = router