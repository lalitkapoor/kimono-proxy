// Module dependencies

var config = require('../config')
var Promise = require('bluebird')
var zlib = require('zlib')
var tar = require('tar-stream')
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
 * Build a docker image
 * @param  {Object} options to configure proxy service
 * @param  {Object} options.tarballLink link to a tarball to build image with
 * @param  {Object} options.tagName tag name to apply to docker image
 * @param  {Function} callback
 * @return {Promise}
 */
exports.buildImage = function (options, callback) {
  return new Promise(function (resolve, reject) {

    var extract = tar.extract()
    var tarball = tar.pack()

    var req = request
    .get(options.tarballLink)
    .on('error', function (error) {
      return reject(error)
    })
    .pipe(zlib.createGunzip())
    .pipe(extract)

    extract.on('entry', function (header, stream, callback) {
      // we are shifting the contents up a directory
      var name = header.name.split('/')
      name.shift()
      header.name = name.join('/')
      if (!header.name) return callback()
      stream.pipe(tarball.entry(header, callback))
    })

    extract.on('finish', function () {
      //add Dockerfile here
      tarball.finalize()
    })

    // build image from tarball stream
    docker.buildImage(tarball
    , { t: options.tagName }
    , function (error, response) {
        if(error) return reject(error)

        var imageId = null // set this to docker image-id if build successful
        response.on('data', function (raw) {
          var data = JSON.parse(raw)

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

      } //buildImage handler
    ) //buildImage
  }).nodeify(callback) // promise
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
 * 2. update proxy in db w/containerId & port info (do this in api, not in this lib)
 */