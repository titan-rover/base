// Author: Khang Pham

import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { MapContainer, Marker, TileLayer, useMap  } from 'react-leaflet';
import '../css/MapTile.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';


/*makes the map to center on the marker*/
function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
}


/*custom control displayed on leaflet map*/
function ButtonControl({click}){
  return (
    <div className={'leaflet-bottom leaflet-left'}>
      <div className="leaflet-control leaflet-bar">
        {/*the button decides whether the map is locked on to the rover marker or not*/}
        <button onClick={click} className="lock-button" id="button">Unlock</button>
      </div>
    </div>
  )
}

/*returns the marker that represents the rover*/
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


/*Creating the default marker*/
const DefaultIcon = L.icon({
    iconUrl: icon,
});
L.Marker.prototype.options.icon = DefaultIcon;

/* function that creates the map*/
function MapTile(props)
{

  const [lat, setLat] = useState(props.latitude);
  const [lng, setLng] = useState(props.longitude);
  const [locked, setLock] = useState(true);
  const [markerList, setMarkerList] = useState(props.markerList);
  const [angle, setAngle] = useState(props.angle);


/*updates the angle */
  useEffect(() => {
    setAngle(props.angle);
  },[props.angle]
)

/*updates the latitude and longitude */
  useEffect(() => {
    setLat(props.latitude);
    setLng(props.longitude);
  }, [props.latitude, props.longitude]
)

/*updates the marker list */
  useEffect(() => {
    setMarkerList(props.markerList);
  }, [props.markerList],
)


/*function that locks and unlocks the map on the centner*/
  const onClickHandler = (e) => {
    let btn = document.getElementById("button");
    if(locked)
    {
      setLock(false);
      btn.innerHTML = 'Lock';
    }
    else
    {
      setLock(true);
      btn.innerHTML = 'Unlock';
    }
  }


  return (
    <Card className="text-center" id="map-id">
      <Card.Header>Map Tile</Card.Header>
      <Card.Body>

        <MapContainer center={[lat, lng]} zoom={15} maxZoom={15} scrollWheelZoom={false} doubleClickZoom={false}>
          {(() => {
            if(locked === true)
            {
              return(
              <ChangeMapView coords ={[lat, lng]} />
              )
            }
          })
          ()}

          <TileLayer

          attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="Fullerton/{z}/{x}/{y}.png"
          />



          <RotateMarker lat={lat} lng={lng} angle={angle} />

          {/*if the markerList has a length that is greater than 0 then display all of the markers in the list*/}
          {
                markerList.length > 0 &&
                markerList.map((marker, index) => {

                 return (
                   <Marker key={index} position={[marker.latitude, marker.longitude]}  >

                   </Marker>

                    );
                  })

          }
          <ButtonControl click={onClickHandler}/>
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
    500
  );

}

tick(state)
{

  this.setState(() => ({
    angle: this.state.angle + 5,
    latitude: this.state.latitude + 0.0001,
    longitude: this.state.longitude + 0.0001
  }))

}

componentDidUpdate(prevProps, prevState)
{

}

url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"

*/
