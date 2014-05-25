// Module dependencies
var router = require('express').Router()

router.post('/notifications', function (req, res) {
  console.log(req.body)
  res.send(200, '')
})

module.exports = router;