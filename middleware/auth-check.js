module.exports = function (req, res, next) {
  if (/^\/v1\/auth\/.*/i.test(req.path)) return next()
  if(!req.user) return res.redirect('/v1/auth/github')
  return next()
}
