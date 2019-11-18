import React from 'react'
import {connect} from 'react-redux'
import {
  starredSegmentsThunk,
  getNewLeadersThunk,
  getNewWeatherThunk
} from '../store/segments'
import PropTypes from 'prop-types'
import ls from 'local-storage'

const Navbar = ({
  starredSegments,
  segments,
  weather,
  getNewLeaders,
  getNewWeather
}) => {
  function handleClickSegments() {
    starredSegments()
  }
  function handleClickLeaders() {
    getNewLeaders(segments)
  }
  function handleClickWeather() {
    getNewWeather(segments)
  }

  return (
    <div>
      <button type="button" onClick={handleClickSegments}>
        {' '}
        Resync All Segments
      </button>
      <button type="button" onClick={handleClickLeaders}>
        {' '}
        Resync Segment Leaders
      </button>
      <button type="button" onClick={handleClickWeather}>
        {' '}
        Resync Weather
      </button>
    </div>
  )
}
const mapState = state => {
  return {
    segments: ls.get('segments') || state.segment.segments,
    weather: ls.get('weather') || state.segment.weather
  }
}
const mapDispatch = dispatch => {
  return {
    starredSegments: () => dispatch(starredSegmentsThunk()),
    getNewLeaders: segments => dispatch(getNewLeadersThunk(segments)),
    getNewWeather: segments => dispatch(getNewWeatherThunk(segments))
  }
}
Navbar.propTypes = {
  segments: PropTypes.array,
  weather: PropTypes.array
}
export default connect(mapState, mapDispatch)(Navbar)
