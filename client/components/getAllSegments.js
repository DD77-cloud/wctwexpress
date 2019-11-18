/* eslint-disable react/no-unused-state */
import ls from 'local-storage'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {starredSegmentsThunk} from '../store/segments'
import PropTypes from 'prop-types'
import {SingleSegment} from './index'
class AllSegmentView extends Component {
  constructor() {
    super()
    this.state = {
      segments: [
        {
          id: 0,
          name,
          segmentDirection: '',
          zoom: 0,
          athleteTime: 0,
          distance: 0,
          komTime: 0,
          polyLine: []
        }
      ],

      weather: [
        [
          {
            windDirection: '',
            windSpeed: '',
            time: ''
          }
        ]
      ]
    }
  }
  async componentDidMount() {
    if (!ls.get('segments')) {
      this.props.starredSegments()
      this.setState({
        weather: this.props.weather,
        segments: this.props.segments
      })
    } else {
      const localWeather = ls.get('weather')
      const localSegments = ls.get('segments')

      await this.setState({weather: localWeather, segments: localSegments})
    }
  }

  render() {
    return (
      <div>
        <table border="1">
          <tbody>
            <tr>
              <th />
              <th>Segment</th>
              <th>Distance</th>
              <th>Personal Best</th>
              <th>KOM</th>
              <th>Behind Leader</th>
              <th>Segment Direction</th>
              <th>Optimal Weather</th>
              <th>Wind Direction</th>
              <th>Wind Speed</th>
            </tr>
            {this.state.segments.map((segment, idx) => {
              return (
                <SingleSegment
                  key={segment.id}
                  segInfo={segment}
                  weatherInfo={this.state.weather[idx]}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
const mapState = state => {
  return {
    segments: state.segment.segments,
    weather: state.segment.weather
  }
}
const mapDispatch = dispatch => {
  return {
    starredSegments: () => dispatch(starredSegmentsThunk())
  }
}
AllSegmentView.propTypes = {
  segments: PropTypes.array,
  weather: PropTypes.array
}
export default connect(mapState, mapDispatch)(AllSegmentView)
