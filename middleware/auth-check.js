module.exports = function (req, res, next) {
  if (/^\/v1\/auth\/.*/i.test(req.path)) return next()
  if (!req.session || !req.session.github || !req.session.github.token)
    return res.redirect('/v1/auth/github')
  return next()
}
