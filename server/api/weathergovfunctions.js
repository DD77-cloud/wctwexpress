const rp = require('request-promise')
module.exports = getLongTermWeatherState
async function getLongTermWeatherState(segment) {
  const weatherObj = [
    {
      windDirection: '',
      windSpeed: '',
      time: ''
    }
  ]

  let end_latitude =
    segment.end_latitude || segment.polyLine[segment.polyLine.length - 1].lat
  let end_longitude =
    segment.end_longitude || segment.polyLine[segment.polyLine.length - 1].lng

  const grid = await getWeatherStation(end_latitude, end_longitude)
  return getWindDirection(grid)
}
async function getWeatherStation(end_latitude, end_longitude) {
  let optionsGrid = {
    headers: {
      'User-Agent': 'FullStack',
      accept: 'application/ld+json'
    },
    uri: `https://api.weather.gov/points/${end_latitude.toFixed(
      4
    )},${end_longitude.toFixed(4)}/`
  }
  let grid = await rp(optionsGrid)
  return grid
}

async function getWindDirection(grid) {
  const optionsWeather = {
    headers: {
      'User-Agent': 'FullStack',
      accept: 'application/ld+json'
    },
    uri: JSON.parse(grid).forecastHourly
  }
  let weather = await rp(optionsWeather)
  let windForecast = []

  JSON.parse(weather).periods.forEach(function(period) {
    windForecast.push({
      windDirection: period.windDirection,
      windSpeed: period.windSpeed,
      time: period.startTime
    })
  })
  return windForecast.slice(0, 24)
}
