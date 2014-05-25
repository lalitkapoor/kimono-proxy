var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var router = require('express').Router()
var authCheck = require('../middleware/auth-check')

router.all('*', authCheck)

router.get('/', function (req, res) {
  // list of all proxies (including other users)
  return res.send(200)
})

  // EXPOSED SCHEMA
  // {
  //   id: int
  // , name: string
  // , subdomain: string
  // , api: url // api proxying to
  // , documentation: string // ideally markdown
  // , userId: int // use github id
  // , username: string // use github username
  // , createdAt: timestamp w/timezone
  // , enabled: boolean
  // }

router.post('/', function (req, res) {
  // create proxy

  // {
  //   name: ''
  // , url: ''
  // , documentation: 'MARKDOWN text here'
  // }
  return res.send(201)
})

router.patch('/:id', function (req, res) {
  // modify proxy that you are authorized to modify
  // create proxy-owner-check middleware
  return res.send(200)
})

router.delete('/:id', function (req, res) {
  // delete proxy that you are authorized to modify
  return res.send(200)
})

router.get('/:id/middleware', function (req, res) {
  // list all middleware for the given proxy
  return res.send(200)
})

router.put('/:id/middleware', function (req, res) {
  // modify proxy's middleware
  return res.send(200)
})

router.post('/:id/start', function (req, res) {
  // start your proxy
  // check if docker container is running
  // if not running, start it, else ignore
  // if already running ignore
  return res.send(200)
})

router.post('/:id/stop', function (req, res) {
  // stop your proxy
  // check if docker container is running
  // if so stop it, else ignore
  return res.send(200)
})

router.post('/:id/restart', function (req, res) {
  // restart your proxy
  // check if docker container is running
  // if so stop it and start it else start it
  return res.send(200)
})

module.exports = router