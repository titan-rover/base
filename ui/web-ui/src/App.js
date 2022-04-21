// React imports
// Bootstrap imports
import "bootswatch/dist/darkly/bootstrap.min.css";
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import "react-toastify/dist/ReactToastify.css";
// import { Dropdown } from "bootstrap";
import "leaflet/dist/leaflet.css"

import React, {Component} from "react";
import {Button, Dropdown} from 'react-bootstrap'
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
// Toastify imports
// Toasts are temporary notifications that pop up for a short amount of time
import {toast, ToastContainer} from "react-toastify";
import ROSLIB from "roslib";

import AntennaSignal from "./components/AntennaSignal";
import Compass from "./components/Compass";
import GPS from "./components/GPS";
// Custom React Components
/*
Import classes from the different component files
*/
import IMU from "./components/IMU";
import InverseKinematics from "./components/InverseKinematics";
import MapTile from "./components/MapTile";
import MobilityCurrentDraw from "./components/MobilityCurrentDraw";
// import XboxController from "./components/XboxController";
import MyNavbar from "./components/Navbar";
import TemperatureSensor from "./components/TemperatureSensor";
import UltrasonicSensor from "./components/UltrasonicSensor";

const styles = {
  grid : {paddingLeft : 0, paddingRight : 0},
  row : {marginLeft : 0, marginRight : 0},
  col : {paddingLeft : 0, paddingRight : 0}
};

class App extends Component {
  // Set Static variables to use as values for other logic
  THROTTLE_RATE = 1000;
  QUEUE_LENGTH = 1;

  POOR_SIGNAL_ID = "poor-signal-id";
  HIGH_CURRENT_ID = "high-current-id";

  constructor(props) {

    super(props);
    console.log("CONSTRUCTOR CALLED");

    // in react, both this.props and this.state represent the rendered values
    // (i.e what's currently on the screen)
    this.state = {
      imu_on : false,
      // Set dictionaries with keys and values with data structures
      imu : {
        // Default/Offset Oriention for Rover Model
        // rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 },
        rotation : {x : 0, y : 0, z : 0},
        position : {x : 0, y : -10, z : 0},
        // heading: null    // Depreciated Variable
      },

      // Following Data is not currently used beyond fake testing data
      //    GPS, Antenna Signal, Ultrasonic Sensor, and Current Draw for Claw
      //    and Mobility, lat and lng used for MapTile
      gps : {currentPosition : [ 33.88, -117.88 ]},

      antenna : {decibels : []},
      ultrasonic : {distance : []},
      roboclaw : {a : {amps : []}, b : {amps : []}},
      mobility : {amps : []},
      latitude : 33.88,
      longitude : -117.88,
      markerList : [],
      angle : 0
    };

    /* this.connectRosBridge(url) is a top level function call that passes the
       url to the connectRosBridge(url) functions
       inside of all the custom react imports we imported at the top. */
    // this.connectRosBridge("ws://192.168.1.100:9090");
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      this.connectRosBridge("ws://localhost:9090");
    } else {
      // production code
      this.connectRosBridge("wss://controls.titanrover.com:9443");
    }

    /* These lines instantiate listeners, publishers, and callback registrations
     * for all the react modules we imported */
    this.createListeners();
    this.createPublishers();
    this.registerCallbacks();

    this.autonomousMarkerHandler = this.autonomousMarkerHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }
  componentWillUnmount() {
    // this.antenna_listener.unsubscribe();
    this.rovergps_listener.unsubscribe();
    // this.imu_listener.unsubscribe();
    // this.mobility_listener.unsubscribe();
    // this.ultrasonic_listener.unsubscribe();
  }

  onClickHandler(e) {
    let btn = document.getElementById("imu_button");
    if (this.state.imu_on) {
      this.setState({imu_on : false})
      btn.innerHTML = 'Display';
    } else {
      this.setState({imu_on : true})
      btn.innerHTML = 'Undisplay';
    }
  }
  autonomousMarkerHandler(markerList) {
    this.setState({markerList : markerList})
  }

  registerCallbacks() {
    // Register ros callbacks
    this.ros.on("connection", () => { this.setState({status : "Connected"}); });
    this.ros.on("error", error => { this.setState({status : "Error"}); });
    this.ros.on("closed", () => { this.setState({status : "Closed"}); });

    // Register listener callbacks
    // Handlers for when ROS messages have been received
    // Generally updates/sets state data which with re-render the UI with new
    // data

    // Antenna message handler
    if (this.antenna_listener) {
      this.antenna_listener.subscribe(m => { // arrow functions are lambas
        let prevData = [...this.state.antenna.decibels ];

        if (prevData.length >= 5) {
          prevData.shift();
        }

        prevData.push([
          new Date().getTime(), m.signal_strength
        ]); // push adds to an array

        if (m.signal_strength < 10) {
          toast.error("SIGNAL STRENGTH CRITICAL!", {
            // display a toast message at position: with the correct css class
            // element (poor_signal_id)
            position : toast.POSITION.BOTTOM_RIGHT,
            toastId : this.POOR_SIGNAL_ID
          });
        }

        this.setState({
          // setState() schedules an update to a component's state object. When
          // state changes the component responds by re-rendering
          antenna : {decibels : prevData}
        });
      });
    }

    // Rover GPS message handler
    if (this.rovergps_listener) {
      this.rovergps_listener.subscribe(m => {
        console.log(m);
        this.setState({
          // setState() schedules an update to a component's state object. When
          // state changes the component responds by re-rendering
          latitude : m.roverLat,
          longitude : m.roverLon
        });
      });
    }

    // IMU message handler
    if (this.imu_listener) {
      this.imu_listener.subscribe(m => {
        // let x = Math.cos(m.yaw) * Math.cos(m.pitch);
        // let y = Math.sin(m.yaw) * Math.cos(m.pitch);
        // let z = Math.sin(m.pitch);

        // Quaternian orientation
        let x = m.orientation.x;
        let y = m.orientation.y;
        let z = m.orientation.z;
        let w = m.orientation.w;

        let roll = null;
        let pitch = null;
        let yaw = null;

        // Convertions to Roll, Pitch, and Yaw
        // Roll
        let sinr_cosp = 2 * (w * x + y * z);
        let cosr_cosp = 1 - 2 * (x * x + y * y);
        roll = Math.atan2(sinr_cosp, cosr_cosp);

        // Pitch
        let sinp = 2 * (w * y - z * x);
        if (Math.abs(sinp) >= 1)
          if (sinp >= 0)
            pitch = Math.PI / 2; // use 90 degrees if out of range
          else
            pitch = -Math.PI / 2;
        else
          pitch = Math.asin(sinp);

        // Yaw
        let siny_cosp = 2 * (w * z + x * y);
        let cosy_cosp = 1 - 2 * (y * y + z * z);
        yaw = Math.atan2(siny_cosp, cosy_cosp);

        // Console Output
        console.log("Yaw: " + yaw);
        console.log("Pitch: " + pitch);
        console.log("Roll: " + roll);

        console.log(m);
        console.log(x, y, z);

        // Set State
        this.setState({
          // setState() schedules an update to a component's state object. When
          // state changes the component responds by re-rendering
          imu : {
            rotation : {
              x : -roll - Math.PI / 2,
              y : -pitch,
              z : yaw + Math.PI / 2
              // x: x - Math.PI/2,
              // y: y,
              // z: z + Math.PI/2
            },
            position : this.state.imu.position
          }
        });
      });
    }

    // Current Draw message handler
    if (this.mobility_listener) {
      this.mobility_listener.subscribe(m => {
        let prevDataA = [...this.state.roboclaw.a.amps ];
        let prevDataB = [...this.state.roboclaw.b.amps ];
        let prevDataC = [...this.state.mobility.amps ];

        if (prevDataA.length >= 5) {
          prevDataA.shift();
        }

        prevDataA.push([ new Date().getTime(), m.current_draw ]);

        if (prevDataB.length >= 5) {
          prevDataB.shift();
        }

        prevDataB.push(
            [ new Date().getTime(), Math.max(m.current_draw - 5, 0) ]);

        if (prevDataC.length >= 5) {
          prevDataC.shift();
        }

        prevDataC.push(m.current_draw);

        if (m.current_draw > 70) {
          toast.warn("CURRENT DRAW HIGH!", {
            position : toast.POSITION.BOTTOM_RIGHT,
            toastId : this.HIGH_CURRENT_ID
          });
        }

        this.setState({
          roboclaw : {a : {amps : prevDataA}, b : {amps : prevDataB}},
          mobility : {amps : prevDataC}
        });
      });
    }

    if (this.ultrasonic_listener) {
      this.ultrasonic_listener.subscribe(m => {
        let prevDataD = [...this.state.ultrasonic.distance ];

        if (prevDataD.length >= 5) {
          prevDataD.shift();
        }

        prevDataD.push(
            [ new Date().getTime(), m.max_distance ]); // push adds to an array

        if (m.max_distance < 10) {
          toast.error("LESS THAN 10 DISTANCE!", {
            // display a toast message at position: with the correct css class
            // element (poor_signal_id)
            position : toast.POSITION.BOTTOM_RIGHT,
            toastId : this.POOR_SIGNAL_ID
          });
        }

        this.setState({ultrasonic : {distance : prevDataD}});
      });
    }
  }

  // Creates ROS Topic objects for Publishers
  createPublishers() {
    try {
      this.gps_publisher = new ROSLIB.Topic({
        ros : this.ros,     // Reference to ROS Node
        name : "/gps_list", // Topic name to publish on
        messageType :
            "mobility/points" // "Package/File" location of message type
      });
    } catch (e) {
      // Fail to create ROS object
      this.setState({status : "Error"});
      console.log("Error: Failed to create ros publisher");
    }
  }

  // Creates ROS Topic objects for Listeners
  // Similar to Publishers, but includes throttle rate and queque for the
  // incoming messages
  createListeners() {
    try {
      this.rovergps_listener = new ROSLIB.Topic({
        ros : this.ros,
        name : "/gnss",
        messageType : "telemetry/gps",
        throttle_rate : this.THROTTLE_RATE,
        queue_length : this.QUEUE_LENGTH
      });
      /*
      this.antenna_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/antenna",
        messageType: "fake_sensor_test/antenna",
        throttle_rate: this.THROTTLE_RATE,
        queue_length: this.QUEUE_LENGTH
      });


      this.basegps_listener = new ROSLIB.Topic({
        ros: this.ros,
        //name: "/rover_gnss",
        //messageType: "telemetry/gps",
        throttle_rate: 10,
        queue_length: this.QUEUE_LENGTH
      });

      // console.log(this.rovergps_listener);

      this.imu_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/imu",
        messageType: "sensor_msgs/Imu",
        // messageType: "sensor_msgs/Imu",
        throttle_rate: this.THROTTLE_RATE,
        queue_length: this.QUEUE_LENGTH
      });

      this.mobility_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/mobility",
        messageType: "fake_sensor_test/mobility",
        throttle_rate: this.THROTTLE_RATE,
        queue_length: this.QUEUE_LENGTH
      });

      this.ultrasonic_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/ultrasonic",
        messageType: "fake_sensor_test/ultrasonic",
        throttle_rate: this.THROTTLE_RATE,
        queue_length: this.QUEUE_LENGTH
      });*/
    } catch (e) {
      // Fail to create ROS object
      this.setState({status : "Error"});
      console.log("Error: Failed to create ros listener");
    }
  }

  // Creates a ROS Node and connects to a ROS server via a url/IP
  connectRosBridge(url) {
    try {
      // ROS Node
      this.ros = new ROSLIB.Ros({url : url});
    } catch (e) {
      // Fail to create ROS Node
      this.setState({status : "Error"});
      console.log("Error: Failed to create ros object");
      return false;
    }
  }

  // Renders Container of Various Components
  // State Data is passed to the appropriate Component Prop Data
  render() {
    return (
      <Container fluid={true} className="pt-2">
        <MyNavbar />
        <Container fluid={true}>
          <Row style={{
      margin: "0px"}}>
            <Col>
              <div style={{
      border: "1px solid green", height: "300px", width: "300px"}}>
                Cam 1(L)
              </div>
              <Dropdown>
                <Dropdown.Toggle id= 'dropdown-basic'>
                  Settings
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1"> Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2"> Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <div style={{
      border: "1px solid green", height: "300px", width: "300px"}}>
                Cam 2(Fwd)
              </div>
              <Dropdown>
                <Dropdown.Toggle id= 'dropdown-basic'>
                  Settings
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1"> Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2"> Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <div style={{
      border: "1px solid green", height: "300px", width: "300px"}}>
                Cam 3(R)
              </div>
              <Dropdown>
                <Dropdown.Toggle id= 'dropdown-basic'>
                  Settings
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1"> Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2"> Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <div style={{
      border: "1px solid green", height: "300px", width: "300px"}}>
                Cam 4(Bck)
              </div>
              <Dropdown>
                <Dropdown.Toggle id= 'dropdown-basic'>
                  Settings
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1"> Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2"> Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="mt-2">
            <Col>
              {/* IMU Component */}


              {(() => {
        if (this.state.imu_on === true) {
                  return(
                    <IMU
                  position = {this.state.imu.position} rotation =
                  {
                    this.state.imu.rotation
                  } />
                  )
                }
              })
              ()}
              <button id="imu_button" onClick={this.onClickHandler}>
              Display
              </button >
                      </Col>
            <Col>
              {/*
                       Antenna Component */}
              <AntennaSignal
                signal_strength={this.state.antenna.decibels} />
                      </Col>
          </Row><Row className = "mt-2">
                      <Col>{/* Mobility Current Draw Component */} <
                      MobilityCurrentDraw
                  current_draw =
                  { this.state.mobility.amps } />
            </Col > <
                      /Row>
          <Row className="mt-2">
            {/*
                          Temperature Component */}

            {/*<TemperatureSensor />*/}

            {/* <Col>
              <MapTile currentPosition = { this.state.gps.currentPosition } /> / /
                      </Col>
          <Col>
            <Compass heading={this.state.imu.heading} /><
                      /Col>
          <Col> */}
        <Col>{/* Ultrasonic Sensor Component */} < UltrasonicSensor
        max_distance =
        { this.state.ultrasonic.distance } />
            </Col > <
            /Row>
          {/*<Row className = "mt-2"><Col><XboxController>
            </XboxController>
            </Col>< /Row> */}
          <Row className="mt-2">
            <Col>
              {/* Map Component */}
              <MapTile angle={this.state.angle} markerList={this.state.markerList} latitude={this.state.latitude} longitude={
        this.state.longitude}/>

            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <InverseKinematics />
            </Col>
            <Col>
              <GPS  autonomousMarkerHandler = {this.autonomousMarkerHandler}/>
            </Col>
          </Row>
          {/* <Row className="mt-2">
          <Col>
            <AntennaSignal decibels={this.state.antenna.decibels} />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <MobilityCurrentDraw
              ampsA={this.state.roboclaw.a.amps}
              ampsB={this.state.roboclaw.b.amps}
            />
          </Col>
        </Row> */}
          {/* Not added by Michael, no idea about Toast */}
          <ToastContainer autoClose={
        3000} />
        </Container>
      </Container>
    );
  }
}

export default App;
