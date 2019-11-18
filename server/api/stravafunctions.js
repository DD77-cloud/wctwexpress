const strava = require('strava-v3')
const decodePolyline = require('decode-google-map-polyline')
module.exports = {getStravaState, getLeader}
async function getStravaState(segment, accToken) {
  let segmentElement = {
    id: 0,
    name: '',
    segmentDirection: '',
    zoom: 0,
    athleteTime: 0,
    distance: 0,
    komTime: 0,
    polyLine: []
  }
  let {
    start_latitude,
    start_longitude,
    end_latitude,
    end_longitude,
    distance
  } = segment
  segmentElement.zoom = calculateZoom(distance)
  segmentElement.segmentDirection = bearing(
    start_latitude,
    start_longitude,
    end_latitude,
    end_longitude
  )
  segmentElement.athleteTime = segment.pr_time
  segmentElement.distance = segment.distance
  segmentElement.polyLine = await getPolyLine(segment, accToken)
  segmentElement.komTime = await getLeader(segment, accToken)
  segmentElement.id = segment.id
  segmentElement.name = segment.name
  return segmentElement
}
async function getPolyLine(segment, accToken) {
  let detailedSegment = await strava.segments.get({
    access_token: accToken,
    id: segment.id
  })
  return decodePolyline(detailedSegment.map.polyline)
}
async function getLeader(segment, accToken) {
  let leaderboard = await strava.segments.listLeaderboard({
    access_token: accToken,
    id: segment.id
  })
  console.log('getLeader', leaderboard.entries[0].elapsed_time)
  return leaderboard.entries[0].elapsed_time
}

function toRadians(degrees) {
  return degrees * Math.PI / 180
}

// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI
}

function bearing(startLat, startLng, destLat, destLng) {
  startLat = toRadians(startLat)
  startLng = toRadians(startLng)
  destLat = toRadians(destLat)
  destLng = toRadians(destLng)

  let y = Math.sin(destLng - startLng) * Math.cos(destLat)
  let x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
  let brng = Math.atan2(y, x)
  brng = Math.abs(toDegrees(brng))

  return compassDirection((brng + 360) % 360)
}
function compassDirection(degrees) {
  switch (true) {
    case degrees >= 315:
      return 'NW'
    case degrees >= 270:
      return 'W'
    case degrees >= 225:
      return 'SW'
    case degrees >= 180:
      return 'S'
    case degrees >= 135:
      return 'SE'
    case degrees >= 90:
      return 'E'
    case degrees >= 45:
      return 'NE'
    default:
      return 'N'
  }
}

function calculateZoom(meters) {
  let count = 0
  let wholeworld = 156000
  while (wholeworld > meters / 125) {
    wholeworld /= 2
    count++
  }
  return count - 1
}
