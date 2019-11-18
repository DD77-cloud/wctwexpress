import React, {Component} from 'react'
import MyMap from '../map.js'
import {getNewWeatherThunk} from '../store/segments'
import {connect} from 'react-redux'
import ls from 'local-storage'

class SingleSegment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      segments: {
        id: 0,
        name,
        segmentDirection: '',
        zoom: 0,
        athleteTime: 0,
        distance: 0,
        komTime: 0,
        polyLine: []
      },

      weather: [
        {
          windDirection: '',
          windSpeed: '',
          time: ''
        }
      ],
      bestWeather: {
        windDirection: '',
        windSpeed: '',
        time: ''
      }
    }
    this.bestWeather = bestWeather.bind(this)
  }
  async componentDidMount() {
    await this.setState({
      segments: this.props.segInfo,
      weather: this.props.weatherInfo
    })
    await this.setState({bestWeather: this.bestWeather()[0]})
    const lastrefresh = ls.get('time')
    const now = new Date()
    if (now - Date.parse(lastrefresh) > 21600000) {
      this.props.getNewWeather(this.state.segments)
    }
  }

  render() {
    return (
      <tr>
        <td>
          <MyMap
            polyline={this.state.segments.polyLine}
            zoom={this.state.segments.zoom}
          />
        </td>
        <td>{this.state.segments.name}</td>
        <td>{(this.state.segments.distance / 1609.344).toFixed(2)}mi</td>
        <td>{this.state.segments.athleteTime}s</td>
        <td>{this.state.segments.komTime}s</td>
        <td>
          {(
            parseInt(this.state.segments.athleteTime) /
            parseInt(this.state.segments.komTime) *
            100
          ).toFixed(0)}%
        </td>
        <td>{this.state.segments.segmentDirection}</td>
        <td>
          {(
            Math.abs(Date.parse(this.state.bestWeather.time) - new Date()) /
            3600000
          ).toFixed(1)}{' '}
          hours from now
        </td>
        <td>
          {this.state.bestWeather.windDirection ||
            this.state.weather[0].windDirection}
        </td>
        <td>
          {this.state.bestWeather.windSpeed || this.state.weather[0].windSpeed}
        </td>
      </tr>
    )
  }
}
const mapDispatch = dispatch => {
  return {
    getNewWeather: segments => dispatch(getNewWeatherThunk(segments))
  }
}
export default connect(null, mapDispatch)(SingleSegment)

function bestWeather() {
  return this.state.weather
    .filter(
      hourlyForecast =>
        hourlyForecast.windDirection === this.state.segments.segmentDirection
    )
    .sort(
      (a, b) =>
        parseInt(a.windSpeed.substring(0, 2)) >
        parseInt(b.windSpeed.substring(0, 2))
    )
}

function noOldWeather() {
  const time = ls.get('time')
}
