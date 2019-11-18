const rp = require('request-promise')
const router = require('express').Router()
const getLongTermWeatherState = require('./weathergovfunctions')
module.exports = router

router.post('/sevendays', async (req, res, next) => {
  try {
    console.log(req.body)
    const getNewWeather = async () => {
      return Promise.all(
        req.body.map(segment => getLongTermWeatherState(segment))
      )
    }
    getNewWeather().then(data => {
      res.json(data)
    })
  } catch (error) {
    next(error)
  }
})
