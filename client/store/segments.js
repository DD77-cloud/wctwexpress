import axios from 'axios'
import history from '../history'
import ls from 'local-storage'

const GET_STARRED_SEGMENTS = 'GET_STARRED_SEGMENTS'
const GET_NEW_LEADERS = 'GET_NEW_LEADERS'
const GET_NEW_WEATHER = 'GET_NEW_WEATHER'
const segmentForState = ls.get('segments') || [
  {
    id: 0,
    name: '',
    segmentDirection: '',
    zoom: 0,
    athleteTime: 0,
    distance: 0,
    komTime: 0,
    polyLine: []
  }
]
const weatherForState = ls.get('weather') || [
  [
    {
      windDirection: '',
      windSpeed: '',
      time: ''
    }
  ]
]
const initialState = {
  segments: segmentForState,
  weather: weatherForState
}
const getAllSegments = segments => ({type: GET_STARRED_SEGMENTS, segments})
const getNewLeaders = leaders => ({type: GET_NEW_LEADERS, leaders})
const getNewWeather = weather => ({type: GET_NEW_WEATHER, weather})
export const getNewWeatherThunk = segments => async dispatch => {
  try {
    const {data} = await axios.post('/api/weathergov/sevendays', segments)
    ls.set('weather', data)
    ls.set('updateTime', new Date())
    dispatch(getNewWeather(data || []))
  } catch (error) {
    console.error(error)
  }
}
export const starredSegmentsThunk = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/strava/getallsegments')
    console.log('starred', data)
    ls.set('segments', data[0])
    ls.set('weather', data[1])
    dispatch(getAllSegments(data || []))
  } catch (error) {
    console.error(error)
  }
}
export const getNewLeadersThunk = segments => async dispatch => {
  try {
    const {data} = await axios.post('/api/strava/segmentleaders', segments)
    dispatch(getNewLeaders(data || []))
  } catch (error) {
    console.error(error)
  }
}
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STARRED_SEGMENTS:
      return {
        ...state,
        segments: action.segments[0],
        weather: action.segments[1]
      }
    case GET_NEW_LEADERS:
      let newSegments = state.segments.map((segment, idx) => {
        return {...segment, komTime: action.leaders[idx]}
      })
      console.log(state)
      return {...state, segments: newSegments}
    case GET_NEW_WEATHER:
      return {...state, weather: action.weather}
    default:
      return state
  }
}
