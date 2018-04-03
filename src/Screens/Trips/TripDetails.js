import React, { Component }from 'react';
import GoogleMapReact from 'google-map-react';

const TripDetails = ({carType, driverName, isActive}) => (
  <div className="trip-map">
    <Map />
    <div className="trip-detail">
      <span> 
        Driver: {driverName}
      </span>
      <span>
        Car: {carType}
      </span>
      <span>
        Availability : {isActive && <b>Active</b>}
      </span>
    </div>
  </div>
)

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
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDJoL_iLPgGVhaKt2-HVPeL-Cr6Dpo4Ru8'}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        />
      </div>
    );
  }
}

// const Map = ({lat, lng, zoom}) => (
//   <div style={{ height: '75vh', width: '100%'}}>
//     <GoogleMapReact
//       bootstrapURLKeys = {{ key: 'AIzaSyDJoL_iLPgGVhaKt2-HVPeL-Cr6Dpo4Ru8'}}
//       center = {{ lat: {lat}, lng: {lng} }}
//       defaultZoom = {zoom}
//     >
//     </GoogleMapReact>
//   </div>
// )

// Map.defaultProps = {
//   lat : 34.000677,
//   lng : -6.849732,
//   zoom : 13
// }

export default TripDetails;