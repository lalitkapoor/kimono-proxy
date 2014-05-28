// Module dependencies

var config = require('../config')
var Promise = require('bluebird')
var zlib = require('zlib')
var GitHubApi = require('github')
var Docker = require('dockerode')
var request = require('superagent')

var github = new GitHubApi({
  version: "3.0.0"
// , debug: true
, timeout: 15000
})

// Common init options are
// {host :'http://localhost', port: 4243}
// {socketPath: '/var/run/docker.sock'}
var docker = new Docker(config.dockerInit)

/**
 * Build a docker image from a tarball
 * @param  {Object} options to configure proxy service
 * @param  {Object} options.tarball tarball stream to build image with
 * @param  {Object} options.tagName tag name to apply to docker image
 * @param  {Function} callback
 * @return {Promise}
 */
exports.buildImage = function (options, callback) {
  return new Promise(function (resolve, reject) {
    // build image from tarball stream
    docker.buildImage(options.tarball
    , { t: options.tagName }
    , function (error, response) {
        if(error) return reject(error)

        var imageId = null // set this to docker image-id if build successful
        response.on('data', function (raw) {
          var data = JSON.parse(raw)
          console.log(data)
          var r = /^successfully built (.*)/i
          if (r.test(data.stream)) {
            var match = r.exec(data.stream)
            imageId = match[1].trim()
          }
        })

        response.on('end', function () {
          if (!imageId) return reject(new Error('image not built successfully'))
          return resolve(imageId)
        })

      } // docker.buildImage
    ) // buildImage
  }).nodeify(callback) // promise
}

/**
 * Launch a docker container given an image id and bind port 80 to hostPort
 * @param  {Object}   options
 * @param  {Object}   options.imageId imageId used to launch the container
 * @param  {Object}   options.hostPort hostPort to bind port 80 to
 * @param  {Function} callback
 * @return {Promise}
 */
exports.launchContainer = function (options, callback) {
  return new Promise(function (resolve, reject) {
    docker.run(options.imageId, null, null
    , {"ExposedPorts": {"80/tcp": {}}}
    , function () {
        // if (error) return console.error(error.stack), reject(error)
      }
    ).on('container', function (container) {
      console.log(container)
      container.defaultOptions.start.PortBindings = {
        "80/tcp": [{ "HostPort": ""+options.hostPort }]
      }
      resolve(container.id)
    })
  }).nodeify(callback)
}

exports.killContainer = function (id, callback) {
  return new Promise(function (resolve, reject) {
    docker.getContainer(id).kill(callback) // (error, data)
  }).nodeify(callback)
}

exports.restartContainer = function (id, callback) {
  return new Promise(function (resolve, reject) {
    docker.getContainer(id).restart({}, callback) // (error, data)
  }).nodeify(callback)
}

// NOTES

/**
 * Build Proxy Image
 * *****************
 * 1. Download api-proxy from github
 * 2. Create Dockerfile
 * 3. update proxy in db w/imageId (do this in api, not in this lib)
 */

/**
 * Launch Proxy Container
 * **********************
 * 1. launch proxy container with correct environment vars
 * 2. update proxy in db w/containerId (do this in api, not in this lib)
 */