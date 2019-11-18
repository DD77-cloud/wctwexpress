import React from 'react'
import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet'

class MyMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: {lat: 40.7128, lng: -74.006},
      zoom: 13,
      polyLine: []
    }
  }

  render() {
    let position = [this.state.center.lat, this.state.center.lng]

    if (this.props.polyline.length > 1) {
      let idx = Math.floor(this.props.polyline.length / 2)
      position = [this.props.polyline[idx].lat, this.props.polyline[idx].lng]
    }

    return (
      <Map
        center={position}
        zoom={this.props.zoom || this.state.zoom}
        dragging={false}
        boxZoom={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        {this.props.polyline && this.props.polyline.length > 1 ? (
          <Polyline color="red" positions={this.props.polyline} />
        ) : (
          <div />
        )}
      </Map>
    )
  }
}

export default MyMap
