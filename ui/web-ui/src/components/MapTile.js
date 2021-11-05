import React, { Component, useEffect, useState  } from "react";
import Card from "react-bootstrap/Card";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap  } from 'react-leaflet';
import '../css/MapTile.css';
import L from "leaflet";
import  MarkerClusterGroup  from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';


function ChangeMapView({ coords }) {
    const map = useMap();


    map.setView(coords, map.getZoom());

    return null;


}


function MapTile(props)
{

  const [lat, setLat] = useState(props.latitude);
  const [lng, setLng] = useState(props.longitude);
  const [toggled, setToggle] = useState(true);

/*
  const tick = () => {
    setLat(lat + 0.001);
    setLng(lng + 0.001);
  }
*/
  useEffect(() =>{
    console.log('component mounted')

    return () => {
      console.log('componet will unmount')
    }

  }, [])// the array at the end tells us that this useEffect acts as ComponentDidMount and the return value acts as ComponentWillUnmount

  useEffect(() => {
    setLat(props.latitude);
    setLng(props.longitude);
  },) // the array at the end tells us that this useEffect acts as ComponentDidUpdate

  const onClickHandler = (e) => {
    if(toggled)
    {
      setToggle(false);
    }
    else
    {
      setToggle(true);
    }
  }

  return (
    <Card className="text-center" id="map-id">
      <Card.Header>Map Tile</Card.Header>
      <Card.Body>
        <button onClick={onClickHandler}>toggle</button>
        <MapContainer center={[lat, lng]} zoom={18} maxZoom={18} scrollWheelZoom={false}>
          {( ()=> {
            if(toggled === true)
            {
              return(
              <ChangeMapView coords ={[lat, lng]} />
              )
            }
            else
            {
              return (null);
            }
          })
          ()}

          <TileLayer
          /*
          url to      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          another map attribution= 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          */
          attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>

          </Marker>

        </MapContainer>
      </Card.Body>
    </Card>
  );

}



export default MapTile;
/*
code for testing purposes
componentDidMount() {

  this.timerID = setInterval(
    () => this.tick(this.state),
    1000
  );

}

tick(state)
{

  this.setState(() => ({
    lat: this.state.lat + 0.00001,
    lng: this.state.lng + 0.00001
  }))

}

componentDidUpdate(prevProps, prevState)
{

}


*/
/* MapTile with class
class MapTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: this.props.coordinates[0],
      lng: this.props.coordinates[1],
      zoom: 15,
      maxZoom: 18
    }

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
    /*
    this.timerID = setInterval(
      () => this.tick(this.state),
      100
    );

  }
  /*
  tick(state)
  {

    this.setState((state) => ({
      lat: this.state.lat,
      lng: this.state.lng,
    }))

  }


  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.coordinates !== this.props.coordinates)
    {
      this.setState( () => ({

        lat: this.props.coordinates[0],
        lng: this.props.coordinates[1],

      }))
      //console.log('hello')
    }
  }


  //render the map
  render() {
    var position = [this.state.lat, this.state.lng];
    return (
      <Card className="text-center" id="map-id">
      <Card.Header>Map Tile</Card.Header>
      <Card.Body>
      <button onClick={handlesetview} >test </button>
      <MapContainer center={position} zoom={this.state.zoom} maxZoom={this.state.maxZoom} scrollWheelZoom={false}>
      <ChangeMapView coords ={position} />
      <TileLayer
      /*
      url to      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      another map attribution= 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'

      attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>

      </Marker>

      </MapContainer>
      </Card.Body>
      </Card>
    );
  }
}
*/
