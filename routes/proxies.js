var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var fs = require('fs')
var tar = require('tar-stream')
var router = require('express').Router()
var authCheck = require('../middleware/auth-check')
var proxyOwnerCheck = require('../middleware/proxy-owner-check')
var db = require('../db')
var docker = require('../lib/docker')

var hostPort = 8080

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
, proxyOwnerCheck
, function (req, res) {
    var sql = 'SELECT * FROM proxies WHERE id = $1'
    var values = [req.params.id]

    db.query.first(sql, values, function (error, row) {
      if (error) return console.error(error.stack), res.send(500)

      fs.readFile(config.templatesDir + '/Dockerfile'
      , {encoding: 'utf8'}
      , function (error, data) {
          if (error) return console.error(error.stack), res.send(500)

          var configLink = req.protocol + '://' + req.get('host') + '/v1/proxies/' + req.params.id
          data = data.replace('{PORT}', 80)
          data = data.replace('{URL}', row.url)
          data = data.replace('{CONFIG_LINK}', configLink)

          var tarball = tar.pack()

          tarball.entry({name: 'Dockerfile'}, data)
          tarball.finalize()

          docker.buildImage({
            tarball: tarball
          , tagName: req.user.id + '-' + row.id + '-' + row.subdomain
          }, function (error, imageId) {
            if (error) return console.error(error.stack), res.send(500)

            var sql = 'UPDATE proxies SET "imageId" = $1, status = $2 '
              + 'WHERE id = $3 RETURNING *'
            var values = [imageId, 'starting', req.params.id]

            db.query.first(sql, values, function (error, row) {
              if (error) return console.error(error.stack), res.send(500)

              docker.killContainer(row.containerId, function (error, data) {
                // don't error out if we can't find a container to kill
                if (error && error.message.indexOf('No such container') === -1)
                  return console.error(error.stack), res.send(500)

                var port = ++hostPort
                console.log(port)
                docker.launchContainer({imageId: imageId, hostPort: port}
                , function (error, containerId) {
                    if (error) return console.error(error.stack), res.send(500)
                    var sql = 'UPDATE proxies SET "containerId" = $1, "status" = $2, "port" = $3 '
                      + 'WHERE id = $4 RETURNING *'
                    var values = [containerId, 'running', port, req.params.id]
                    db.query.first(sql, values, function (error, row) {
                      if (error) return console.error(error.stack), res.send(500)
                      return res.json(200, row)
                    })
                  }
                )
              })
            })
          })
        }
      )
    })

    // check if docker container is running
    // if not running, start it, else ignore
    // if already running ignore
  }
)


// stop your proxy
router.post('/:id/stop'
, authCheck
, proxyOwnerCheck
, function (req, res) {

    return res.send(200)
  }
)


// restart your proxy
router.post('/:id/restart'
, authCheck
, proxyOwnerCheck
, function (req, res) {
    // check if docker container is running
    // if so stop it and start it else start it
    return res.send(200)
  }
)

module.exports = router
