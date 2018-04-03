import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const CarPosition = ({ text }) => <div>{text}</div>;

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 34.000677,
      lng: -6.849732
    },
    zoom: 12
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDJoL_iLPgGVhaKt2-HVPeL-Cr6Dpo4Ru8'}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <CarPosition
            lat={34.000677}
            lng={-6.849732}
            text={'Rabat, Maroc'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
