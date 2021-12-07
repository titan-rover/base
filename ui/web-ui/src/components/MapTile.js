import React, { useEffect, useState, useRef  } from "react";
import Card from "react-bootstrap/Card";
import { MapContainer, Marker, Popup, TileLayer, useMap  } from 'react-leaflet';
import '../css/MapTile.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {divIcon} from "leaflet";
import localforage from 'localforage';
import icon from 'leaflet/dist/images/marker-icon.png';


/*makes the map to center on the marker*/
function ChangeMapView({ coords }) {
    const map = useMap();


    map.setView(coords, map.getZoom());

    return null;


}
function RotateMarker(props)
{
  var customIcon = new L.divIcon({
    html: `<img class="leaflet-marker-icon" src="arrow.svg" alt="compass arrow" id="roverIcon" style="
    transform: translate(-11px, -11px) rotate(`+ props.angle + `deg);
    -moz-transform: translate(-11px, -11px) rotate(`+ props.angle + `deg);
    -webkit-transform: translate(-11px, -11px) rotate(`+ props.angle + `deg);"/>`,
    iconSize: new L.Point(20, 20),
    className: 'icon',
  });
  return <Marker position = {[props.lat,props.lng]} icon={customIcon}> </Marker>;
}


/*Defines the default marker*/
const DefaultIcon = L.icon({
    iconUrl: icon,
});
L.Marker.prototype.options.icon = DefaultIcon;




function MapTile(props)
{

  const [lat, setLat] = useState(props.latitude);
  const [lng, setLng] = useState(props.longitude);
  const [toggled, setToggle] = useState(true);
  const [markerList, setMarkerList] = useState(props.markerList);
  const [angle, setAngle] = useState(props.angle);

/*runs when the MapTile component is mounted and unmounted */
  useEffect(() =>{


    return () => {

    }

  }, [])


  useEffect(() => {
    setAngle(props.angle);

  },[props.angle]
)

/*checks changes the latitude and longitude when they are changed in App.js*/
  useEffect(() => {
    setLat(props.latitude);
    setLng(props.longitude);
  }, [props.latitude, props.longitude]
)

  useEffect(() => {
    setMarkerList(props.markerList);
  }, [props.markerList],
)

const mounted = useRef();
useEffect(() => {
  if (!mounted.current) {
    // do componentDidMount logic

    mounted.current = true;
  } else {
    // do componentDidUpdate logic


  }
});



/*function that locks and unlocks the map on the centner*/
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
        <MapContainer center={[lat, lng]} zoom={15} maxZoom={18} scrollWheelZoom={false}>
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
          url="Fullerton/{z}/{x}/{y}.png"
          />



          <RotateMarker lat={lat} lng={lng} angle={angle} />

          {
                markerList.length > 0 &&
                markerList.map((marker, index) => {

                 return (
                   <Marker key={index} position={[markerList[index].latitude, markerList[index].longitude]}  >

                   </Marker>

                    );
                  })




          }

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
