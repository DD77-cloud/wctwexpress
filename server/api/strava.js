const router = require('express').Router()
const strava = require('strava-v3')
const {getStravaState, getLeader} = require('./stravafunctions')
const getLongTermWeatherState = require('./weathergovfunctions')
module.exports = router
let refToken = process.env.STRAVA_REFRESH_TOKEN
const getToken = async function(req, res, next) {
  try {
    req.accessToken = await strava.oauth.refreshToken(refToken)
    refToken = req.accessToken.refresh_token
    next()
  } catch (error) {
    next(error)
  }
}
router.use(getToken)
router.get('/getallsegments', async (req, res, next) => {
  try {
    let segmentArray = []
    let segmentList = await strava.segments.listStarred({
      access_token: req.accessToken.access_token
    })

    segmentList = segmentList.filter(
      segment => segment.country === 'United States'
    )
    const getSegmentInfo = async () => {
      return Promise.all(
        segmentList.map(element =>
          getStravaState(element, req.accessToken.access_token)
        )
      )
    }
    const getWeatherInfo = async () => {
      return Promise.all(
        segmentList.map(element => getLongTermWeatherState(element))
      )
    }
    const getInitialInfo = async () => {
      const Segment = await getSegmentInfo()
      segmentArray.push(Segment)
      const Weather = await getWeatherInfo()
      segmentArray.push(Weather)
    }
    getInitialInfo().then(data => {
      res.json(segmentArray)
    })
  } catch (err) {
    next(err)
  }
})
router.post('/segmentleaders', async (req, res, next) => {
  try {
    const getNewLeaders = async () => {
      return Promise.all(
        req.body.map(segment =>
          getLeader(segment, req.accessToken.access_token)
        )
      )
    }
    getNewLeaders().then(data => {
      res.json(data)
    })
  } catch (error) {
    next(error)
  }
})
