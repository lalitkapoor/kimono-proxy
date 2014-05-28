require('dotenv').load()

var _ = require('lodash')

var config = {
  defaults: {
    host: 'localhost'
  , port: process.env['PORT'] || 5000
  , pg: {
      connStr: 'postgres://localhost:5432/kimproxy'
    }
  , github: {
      clientId: process.env['GITHUB_CLIENT_ID']
    , clientSecret: process.env['GITHUB_CLIENT_SECRET']
    }
  , templatesDir: __dirname + '/templates'
  }

, dev: {
    env: 'dev'
  , isDev: true
  , pg: {
      connStr: 'postgres://localhost:5432/kimproxy'
    }
  , dockerInit: {
      host: 'http://localhost'
    , port: 4243
    }
  }

, prod: {
    env: 'prod'
  , isProd: true
  , host: 'kimono.lalitkapoor.com'
  , dockerInit: {
      socketPath: '/var/run/docker.sock'
    }
  }
}

var env = process.env['ENV'] = process.env['ENV'] || 'dev'
if (!env || !config.hasOwnProperty(env)) env = 'dev'

module.exports = _.defaults(config[env], config.defaults)
console.log('Loading',  env, 'config')
