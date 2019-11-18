const router = require('express').Router()
module.exports = router

router.use('/strava', require('./strava'))
router.use('/weathergov', require('./weathergov'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
