/**
 * Module dependencies
 */

var config = require('./config')
var express = require('express')
var path = require('path')

// Middleware
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
var methodOverride = require('method-override')
var domainMiddleware = require('express-domain-middleware')
var cors = require('./middleware/cors')

//Routes
var auth = require('./routes/auth')
var proxy = require('./routes/proxy')
var middleware = require('./routes/middleware')

// Hooks
var hooks = {}
hooks.github = require('./routes/hooks/github')

var app = express()
app.use(domainMiddleware)
app.use(bodyParser({limit: '10mb'}))
app.use(methodOverride())
app.use(cors)
app.use(cookieParser())
app.use(session({
  secret: '<3 KIMONO FTW!'
, key: 'sid'
, cookie: {
    secure: true
  , maxage: null // browser session cookie
  }
}))

app.use('', express.static(path.join(__dirname, 'public')))
app.use('/v1/auth', auth)
app.use('/v1/proxy', proxy)
app.use('/v1/middleware', middleware)

app.use('/v1/hooks/github', hooks.github)

app.get(/^\/?$/, function (req, res) {
  res.send(200, '')
})
// last resort error handler
app.use(function (err, req, res, next) {
  console.error(err.name, err.stack)
  res.send(500, 'An error has occurred')
})

app.listen(config.port, function () {
  console.log('launched on port', config.apiPort)
})