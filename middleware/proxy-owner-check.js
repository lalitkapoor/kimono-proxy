var db = require('../db')

module.exports = function (req, res, next) {
  var sql = 'SELECT id FROM proxies WHERE id = $1 AND "userId" = $2'
  var values = [req.params.id, req.user.id]

  db.query.first(sql, values, function (error, row) {
    if (error) return console.error(error.stack), res.json(500)
    if (!row) return res.json(401)
    return next()
  })
}
