var db = require('../db')

module.exports = function(req, res, next) {
  if(!req.session || !req.session.user || req.session.user.id == null) return next()

  var sql = 'SELECT * FROM users '
          + 'WHERE id = $1'
  var values = [req.session.user.id]

  db.query.first(sql, values, function (error, row) {
    if (error) return res.json(500)

    req.user = row
    return next()
  })
}