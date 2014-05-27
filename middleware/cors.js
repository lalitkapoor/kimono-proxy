/*
  CORS Middleware
*/

var cors = function(req, res, next) {
  // req.headers['origin'] is necessary to get authorization to work
  res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, PATCH, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
  res.setHeader('Access-Control-Expose-Headers', req.headers['access-control-request-headers'])

  // intercept OPTIONS method, this needs to respond with a zero length response (pre-flight for CORS).
  if (req.method === 'OPTIONS') return res.send(200)
  next()
}
module.exports = cors