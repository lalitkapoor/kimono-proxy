// Module dependencies

var config = require('../config')
var _ = require('lodash')
var Promise = require('bluebird')
var GitHubApi = require('github')
var request = require('superagent')
var crypto = Promise.promisifyAll(require('crypto'))
var router = require('express').Router()
var db = require('../db')

var github = new GitHubApi({
  version: "3.0.0"
// , debug: true
, timeout: 15000
})

// move this client side
router.get('/github', function (req, res) {
  var scope = ['user', 'repo', 'write:repo_hook']
  var githubUrl = 'https://github.com/login/oauth/authorize?'

  crypto.randomBytesAsync(48).then(function (buf) {
    // we should be saving the state to a datastore for security
    var state = buf.toString('hex')

    var redirectUri = req.protocol + '://'
      + config.host + ':' + config.port
      + '/v1/auth/github/callback'

    githubUrl += 'client_id=' + config.github.clientId
    githubUrl += '&redirect_uri=' + redirectUri
    githubUrl += '&scope=' + scope.join(',')
    githubUrl += '&state=' + state

    res.redirect(githubUrl)
  })
})

router.get('/github/callback', function (req, res) {
  var githubUrl = 'https://github.com/login/oauth/access_token'

  // we should be checking this, but ignore for now, store in a datastore
  // if(!states.hasOwnProperty(req.query.state)) return res.send('invalid state')
  // delete states[req.query.state] // clean up

  request.post(githubUrl)
  .send({
    client_id: config.github.clientId
  , client_secret: config.github.clientSecret
  , code: req.query.code
  })
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  .end(function (error, githubResponse) {
    if (error) return res.send(500, 'an error occurred')

    var oauth = githubResponse.body
    var token = oauth.access_token

    github.authenticate({type: 'oauth', token: token})
    github.user.get({}, function (err, user) {
      if (error) return res.send(500, 'an error occurred talking to github')
      if (!user.id) return res.send(500, 'an error occurred getting user from github')

      // upsert incase github token changes
      var sql = 'WITH upsert AS ( '
        + 'UPDATE users SET "githubToken" = $1, "githubUsername" = $2'
        + 'WHERE "githubId" = $3 RETURNING * '
        + '), '
        + 'outcome AS ( '
        + 'INSERT INTO users ("email", "name", "githubId", "githubUsername", "githubToken") '
        + 'SELECT $4, $5, $6, $7, $8 '
        + 'WHERE NOT EXISTS (SELECT id FROM upsert LIMIT 1) RETURNING * '
        + ') '
        + 'SELECT * FROM upsert UNION ALL SELECT * FROM outcome'
      var values = [
        token
      , user.login
      , user.id
      , user.email
      , user.name
      , user.id
      , user.login
      , token
      ]

      db.query.first(sql, values, function (error, row) {
        if (error) return console.error(error.stack), res.send(500)

        if (row) req.session.user = {id: row.id}
        return res.redirect('/')
      })
    })
  })
})

module.exports = router
