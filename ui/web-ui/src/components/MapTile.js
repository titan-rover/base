import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl  } from 'react-leaflet';
import '../css/MapTile.css';
import L from "leaflet";
import  MarkerClusterGroup  from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';
import icon from 'leaflet/dist/images/car.svg';


const robotMarker = [
  {
    lat: 0,
    lng: 0,
    name: "Robot",
    info: '' //we can pass in info here
  }
]


const customMarker = new L.icon({
  iconUrl: icon,
  iconSize: new L.Point(35, 46),
  // iconAnchor:   [22, 94],
});


class MapTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: this.props.lat,
      lng: this.props.lng,
      zoom: 15,
      maxZoom: 30
    }

    robotMarker[0].lat = this.props.lat;
    robotMarker[0].lng = this.props.lng;
  }

  componentDidMount() {
  //Defining the offline layer for the map
    const map = L.map('map-id');
    const offlineLayer = L.tileLayer.offline('https://{s}.tile.osm.org/{z}/{x}/{y}.png', localforage, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    minZoom: 13,
    maxZoom: 19,
    crossOrigin: true
});
    offlineLayer.addTo(map);//add the offline layer
    map.zoomControl.remove();
  //  map.addControl(searchControl);

  this.timerID = setInterval(
    () => this.tick(),
    100
  );

  }

  tick()
  {

    this.setState({
      lat: this.lat + 0.0001,
      lng: this.lng + 0.0001,
      zoom: 15,
      maxZoom: 30
    })

    robotMarker[0].lat += 0.0001;
    robotMarker[0].lng += 0.0001;
  }

  //Render pop up for markers
  renderPopup = (index) =>{
    return (
      <Popup
        tipSize={5}
        anchor="bottom-right"
        longitude={robotMarker.lng}
        latitude={robotMarker.lat}
      >
        <p>
          <strong>{robotMarker.name}</strong>
          <br />
          Available beds:{robotMarker.info}
        </p>
      </Popup>
    );
  }

  //render the map
  render() {
    const position = [this.state.lat, this.state.lng];
    console.log(position);
    return (
      <Card className="text-center" id="map-id">
        <Card.Header>Map Tile</Card.Header>
        <Card.Body>
       <MapContainer center={position} zoom={15} maxZoom={20} scrollWheelZoom={false}>
       <ZoomControl  position="topright" />
        <TileLayer
        // url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        //   attribution= 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="Fullerton/{z}/{x}/{y}.png"
        />
         <MarkerClusterGroup
          showCoverageOnHover={true}
          spiderfyDistanceMultiplier={2}
          iconCreateFunction={this.customIconCreateFunction}
        >
          {robotMarker.map((marker, index) => {
            let post = [marker.lat, marker.lng];
            return (
              <Marker key={index} position={post} icon={customMarker} >
                {this.renderPopup(index)}
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      </Card.Body>
      </Card>
    );
  }
}
export default MapTile;

/*
class MapTile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Card className="text-center" bg="warning">
        <Card.Header>Map Tile</Card.Header>
        <Card.Body>
          <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional
            content.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
*/
