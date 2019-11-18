const passport = require('passport')
const router = require('express').Router()
const StravaStrategy = require('passport-strava-oauth2').Strategy

module.exports = router
passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})
if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
  console.log('Strava client ID / secret not found. Skipping Strava OAuth.')
} else {
  const stravaConfig = {
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: process.env.STRAVA_REDIRECT_URI
  }

  const strategy = new StravaStrategy(
    stravaConfig,
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(function() {
        return done(null, profile)
      })
    }
  )

  passport.use(strategy)

  router.get('/', passport.authenticate('strava', {scope: ['read_all']}))

  router.get(
    '/callback',
    passport.authenticate('strava', {
      successRedirect: '/getallsegments',
      failureRedirect: '/'
    })
  )
}
